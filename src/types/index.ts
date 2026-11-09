import type { IconType } from 'react-icons'

export interface SkillGroup {
  label: string
  blurb: string
  skills: { name: string; Icon?: IconType }[]
  /** Spans two columns in the bento grid on large screens */
  wide?: boolean
}

export interface Experience {
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  bullets: string[]
  metrics: string[]
}

export interface Project {
  number: string
  title: string
  kind: string
  tags: string[]
  description: string
  highlights?: string[]
  githubUrl?: string
  liveUrl?: string
  image?: string
  /** Live diagram shown instead of the image */
  demo?: 'agents' | 'peft' | 'kmeans'
  featured?: boolean
}

export interface OpenSourcePR {
  number: number
  title: string
  url: string
  mergedAt: string
  additions: number
  deletions: number
  commits: number
}

export interface OpenSourceStats {
  url: string
  description: string
  stars: number
  forks: number
  release?: string
  license?: string
  /** All of your merged PRs in the repo, not only the ones listed */
  totalMerged: number
  /** Newest first */
  prs: OpenSourcePR[]
  /** When this data was read from GitHub (ISO date) */
  asOf: string
}

export interface OpenSourceProject {
  owner: string
  repo: string
  role: string
  /** Shown straight away, and kept if GitHub can't be reached */
  snapshot: OpenSourceStats
}
