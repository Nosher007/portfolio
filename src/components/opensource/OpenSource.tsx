import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { FiArrowUpRight } from 'react-icons/fi'
import { GoGitBranch, GoRepoForked, GoStar } from 'react-icons/go'
import Reveal from '../ui/Reveal'
import MergePipeline from './MergePipeline'
import { OTHER_COLOR, parseTitle, TYPE_COLOR } from './commit'
import { GITHUB_USER, OPEN_SOURCE } from '../../data/openSource'
import { loadOpenSource } from '../../lib/github'
import type { OpenSourceProject } from '../../types'

type Status = 'syncing' | 'live' | 'snapshot'

const fmtDay = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
const fmtFull = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

/** `code` spans in PR titles */
function withCode(text: string): ReactNode {
  return text.split(/`([^`]+)`/).map((part, i) =>
    i % 2 ? (
      <code key={i} className="text-accent-soft">
        {part}
      </code>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  )
}

/** Five-block bar of added vs removed lines, like GitHub's */
function DiffBar({ add, del }: { add: number; del: number }) {
  const total = add + del
  const addBlocks = total ? Math.round((add / total) * 5) : 0
  const delBlocks = total ? Math.min(5 - addBlocks, Math.max(del ? 1 : 0, Math.round((del / total) * 5))) : 0
  return (
    <span aria-hidden="true" className="inline-flex gap-[2px]">
      {Array.from({ length: 5 }, (_, i) => (
        <i
          key={i}
          className={`h-[7px] w-[7px] rounded-[1.5px] ${i < addBlocks ? 'bg-accent-cyan' : i < addBlocks + delBlocks ? 'bg-[#ff8fb1]' : 'bg-white/[0.08]'}`}
        />
      ))}
    </span>
  )
}

function TypeChip({ type, scope }: { type: string; scope: string }) {
  if (!type) return null
  const color = TYPE_COLOR[type] ?? OTHER_COLOR
  const solid = type === 'feat' || type === 'fix'
  return (
    <span
      className="mr-1.5 whitespace-nowrap rounded-md px-1.5 py-px text-[10.5px] font-semibold"
      style={solid ? { background: color, color: '#07070b' } : { background: `${color}26`, color }}
    >
      {type}
      {scope && `(${scope})`}
    </span>
  )
}

function StatusPill({ status, asOf }: { status: Status; asOf: string }) {
  const label = status === 'live' ? 'live from GitHub' : status === 'syncing' ? 'syncing…' : 'snapshot'
  return (
    <span className="ml-auto inline-flex flex-shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-white/10 px-2.5 py-0.5 text-[10.5px] text-zinc-400">
      <i className={`h-1.5 w-1.5 rounded-full ${status === 'live' ? 'bg-emerald-400 shadow-[0_0_0_3px_rgba(110,231,168,0.15)]' : 'bg-zinc-500'}`} />
      {label}
      {status === 'snapshot' && <span className="hidden sm:inline">· {fmtFull(asOf)}</span>}
    </span>
  )
}

function ProjectLog({ project }: { project: OpenSourceProject }) {
  const cardRef = useRef<HTMLElement>(null)
  const [data, setData] = useState(project.snapshot)
  const [status, setStatus] = useState<Status>('syncing')
  const [step, setStep] = useState<{ current: number | null; merged: number }>({ current: null, merged: Infinity })

  // Fetch live data once the card is close to the screen, so visitors who never scroll here don't use GitHub requests
  useEffect(() => {
    const card = cardRef.current
    if (!card) return
    let alive = true
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        loadOpenSource(project.owner, project.repo, GITHUB_USER)
          .then((live) => {
            if (!alive) return
            setData(live)
            setStatus('live')
          })
          .catch(() => {
            if (alive) setStatus('snapshot')
          })
      },
      { rootMargin: '600px' },
    )
    io.observe(card)
    return () => {
      alive = false
      io.disconnect()
    }
  }, [project])

  const newestFirst = data.prs
  const oldestFirst = useMemo(() => [...data.prs].reverse(), [data.prs])
  const onStep = useCallback((current: number | null, merged: number) => setStep({ current, merged }), [])
  const add = newestFirst.reduce((s, p) => s + p.additions, 0)
  const del = newestFirst.reduce((s, p) => s + p.deletions, 0)
  const commits = newestFirst.reduce((s, p) => s + p.commits, 0)
  const partial = data.totalMerged > newestFirst.length
  const allPrsUrl = `${data.url}/pulls?q=${encodeURIComponent(`is:pr is:merged author:${GITHUB_USER}`)}`

  return (
    <article ref={cardRef} className="min-w-0 overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0a0a10] font-mono">
      <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-3.5 py-2.5 text-[11px] text-zinc-500">
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="ml-3 min-w-0 truncate">~/open-source/{project.repo}</span>
        <StatusPill status={status} asOf={data.asOf} />
      </div>

      <div className="space-y-4 p-4 text-[12.5px] sm:p-6">
        <p className="break-words text-zinc-500">
          $ git log <span className="text-accent-cyan">--author={GITHUB_USER}</span> --merges --graph
        </p>

        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
          <GoGitBranch className="text-accent-soft" aria-hidden />
          <a href={data.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-white transition-colors hover:text-accent-cyan">
            {project.owner}/{project.repo}
          </a>
          <span className="chip !py-0.5">
            <GoStar aria-hidden /> <b className="font-medium tabular-nums text-white">{data.stars}</b>
            <span className="sr-only">stars</span>
          </span>
          <span className="chip !py-0.5">
            <GoRepoForked aria-hidden /> <b className="font-medium tabular-nums text-white">{data.forks}</b>
            <span className="sr-only">forks</span>
          </span>
          {data.release && <span className="chip !py-0.5">{data.release}</span>}
          {data.license && <span className="chip !py-0.5">{data.license}</span>}
          <span className="chip !border-transparent !bg-accent-soft !py-0.5 font-semibold !text-ink-950">{project.role.toLowerCase()}</span>
        </div>
        {data.description && <p className="max-w-3xl font-sans text-sm leading-relaxed text-zinc-400">{data.description}</p>}

        {oldestFirst.length > 0 && <MergePipeline prs={oldestFirst} onStep={onStep} />}

        <ol aria-label={`Your merged pull requests in ${project.repo}`}>
          {newestFirst.map((pr) => {
            const { type, scope, text } = parseTitle(pr.title)
            const index = oldestFirst.findIndex((p) => p.number === pr.number)
            const isMerged = index < step.merged
            const isLanding = step.current === pr.number
            return (
              <li
                key={pr.number}
                className="relative before:absolute before:bottom-0 before:left-[8px] before:top-0 before:w-0.5 before:bg-accent/30 first:before:top-1/2 last:before:bottom-1/2 only:before:hidden"
              >
                <a
                  href={pr.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group grid grid-cols-[18px_auto_minmax(0,1fr)] items-center gap-x-2.5 gap-y-0.5 rounded-lg py-1.5 pr-2 transition-colors hover:bg-accent/[0.07] sm:grid-cols-[18px_auto_minmax(0,1fr)_auto] ${isLanding ? 'bg-accent-cyan/[0.07]' : ''}`}
                >
                  <span
                    aria-hidden="true"
                    className={`relative z-10 ml-[2px] h-3 w-3 rounded-full border-2 transition-all duration-300 group-hover:border-accent-cyan group-hover:bg-accent-cyan ${
                      isLanding
                        ? 'border-accent-cyan bg-accent-cyan shadow-[0_0_10px_#5ee6ff]'
                        : isMerged
                          ? 'border-accent bg-accent'
                          : 'border-white/25 bg-ink-950'
                    }`}
                  />
                  <span className="text-accent-cyan">#{pr.number}</span>
                  <span className="col-start-2 col-end-4 row-start-2 min-w-0 text-zinc-200 sm:col-start-3 sm:col-end-4 sm:row-start-1 sm:truncate">
                    <TypeChip type={type} scope={scope} />
                    {withCode(text)}
                  </span>
                  <span className="col-start-3 row-start-1 inline-flex items-center gap-2.5 justify-self-end whitespace-nowrap text-zinc-500 sm:col-start-4">
                    <span className="tabular-nums">
                      <span className="text-accent-cyan">+{pr.additions}</span> <span className="text-[#ff8fb1]">−{pr.deletions}</span>
                    </span>
                    <DiffBar add={pr.additions} del={pr.deletions} />
                    <span>{fmtDay(pr.mergedAt)}</span>
                  </span>
                </a>
              </li>
            )
          })}
        </ol>

        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-dashed border-white/15 pt-3 text-zinc-400">
          <p className="tabular-nums">
            {data.totalMerged} merged pull request{data.totalMerged === 1 ? '' : 's'}
            {partial ? ` (latest ${newestFirst.length}: ` : ', '}
            {commits} commits, <span className="text-accent-cyan">{add} insertions(+)</span>,{' '}
            <span className="text-[#ff8fb1]">{del} deletions(−)</span>
            {partial ? ')' : ''}
          </p>
          <a href={allPrsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-zinc-300 transition-colors hover:text-accent-cyan">
            All on GitHub <FiArrowUpRight aria-hidden />
          </a>
        </div>
      </div>
    </article>
  )
}

/** Merged contributions to other people's projects, kept live from GitHub */
export default function OpenSource() {
  return (
    <div className="mt-24">
      <Reveal className="mb-8">
        <p className="eyebrow mb-3 flex items-center gap-3">
          <span className="h-px w-8 bg-gradient-to-r from-accent to-accent-cyan" />
          Open source
        </p>
        <h3 className="font-sora text-[clamp(24px,3vw,34px)] font-bold leading-tight tracking-tight text-white">
          Code I&apos;ve <span className="text-gradient">shipped upstream.</span>
        </h3>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-zinc-400">
          Pull requests I&apos;ve had merged into other people&apos;s projects. The numbers come live from GitHub.
        </p>
      </Reveal>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6">
        {OPEN_SOURCE.map((p) => (
          <Reveal key={`${p.owner}/${p.repo}`} className="min-w-0">
            <ProjectLog project={p} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}
