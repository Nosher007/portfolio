import type { OpenSourcePR, OpenSourceStats } from '../types'

/*
 * Reads public data from GitHub's REST API in the visitor's browser (no token,
 * 60 requests per hour per visitor). Repo stats are cached for an hour; a
 * merged PR never changes, so its details are cached for good.
 */
const API = 'https://api.github.com'
const STATS_TTL = 60 * 60 * 1000
/** How many of your most recent merged PRs to list per project */
export const PR_LIMIT = 6

function readCache<T>(key: string, ttl?: number): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const { at, value } = JSON.parse(raw) as { at: number; value: T }
    return ttl && Date.now() - at > ttl ? null : value
  } catch {
    return null
  }
}

function writeCache(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify({ at: Date.now(), value }))
  } catch {
    /* storage full or blocked: just skip caching */
  }
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(API + path, { headers: { Accept: 'application/vnd.github+json' } })
  if (!res.ok) throw new Error(`GitHub ${res.status} for ${path}`)
  return res.json() as Promise<T>
}

interface RepoResponse {
  html_url: string
  description: string | null
  stargazers_count: number
  forks_count: number
  license: { spdx_id: string | null } | null
}
interface SearchResponse {
  total_count: number
  items: { number: number }[]
}
interface PullResponse {
  number: number
  title: string
  html_url: string
  merged_at: string | null
  additions: number
  deletions: number
  commits: number
}

async function pullDetails(owner: string, repo: string, n: number): Promise<OpenSourcePR | null> {
  const key = `os:pr:v1:${owner}/${repo}#${n}`
  const cached = readCache<OpenSourcePR>(key)
  if (cached) return cached
  const pr = await get<PullResponse>(`/repos/${owner}/${repo}/pulls/${n}`)
  if (!pr.merged_at) return null
  const value: OpenSourcePR = {
    number: pr.number,
    title: pr.title,
    url: pr.html_url,
    mergedAt: pr.merged_at,
    additions: pr.additions,
    deletions: pr.deletions,
    commits: pr.commits,
  }
  writeCache(key, value)
  return value
}

export async function loadOpenSource(owner: string, repo: string, user: string): Promise<OpenSourceStats> {
  const key = `os:stats:v1:${owner}/${repo}:${user}`
  const cached = readCache<OpenSourceStats>(key, STATS_TTL)
  if (cached) return cached

  const query = encodeURIComponent(`repo:${owner}/${repo} author:${user} is:pr is:merged`)
  const [info, release, search] = await Promise.all([
    get<RepoResponse>(`/repos/${owner}/${repo}`),
    get<{ tag_name: string }>(`/repos/${owner}/${repo}/releases/latest`).catch(() => null),
    get<SearchResponse>(`/search/issues?q=${query}&sort=created&order=desc&per_page=${PR_LIMIT}`),
  ])
  const prs = (await Promise.all(search.items.map((item) => pullDetails(owner, repo, item.number))))
    .filter((p): p is OpenSourcePR => p !== null)
    .sort((a, b) => b.mergedAt.localeCompare(a.mergedAt))

  const value: OpenSourceStats = {
    url: info.html_url,
    description: info.description ?? '',
    stars: info.stargazers_count,
    forks: info.forks_count,
    release: release?.tag_name,
    license: info.license?.spdx_id && info.license.spdx_id !== 'NOASSERTION' ? info.license.spdx_id : undefined,
    totalMerged: search.total_count,
    prs,
    asOf: new Date().toISOString(),
  }
  writeCache(key, value)
  return value
}
