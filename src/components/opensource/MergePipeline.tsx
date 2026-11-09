import { useEffect, useRef, useState } from 'react'
import type { OpenSourcePR } from '../../types'
import { svgEl, VIZ } from '../viz/shared'
import { OTHER_COLOR, parseTitle, TYPE_COLOR } from './commit'

const PER_PR = 1.1 // seconds between merges
const TRAVEL = 0.8 // seconds for one branch to reach main

interface Props {
  /** Oldest first */
  prs: OpenSourcePR[]
  /** Which PR is landing right now (or null) and how many have merged so far */
  onStep: (current: number | null, merged: number) => void
}

/**
 * Each PR drawn as a branch that leaves main and merges back in. Plays once
 * when scrolled into view; decorative, so hidden from screen readers.
 */
export default function MergePipeline({ prs, onStep }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const onStepRef = useRef(onStep)
  const [replays, setReplays] = useState(0)

  useEffect(() => {
    onStepRef.current = onStep
  })

  useEffect(() => {
    const wrap = wrapRef.current
    const svg = svgRef.current
    if (!wrap || !svg || prs.length === 0) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    type Branch = { pr: OpenSourcePR; path: SVGPathElement; len: number; label: SVGTextElement; node: SVGCircleElement; dot: SVGCircleElement; color: string }
    let branches: Branch[] = []
    let time = Infinity // Infinity = everything merged (the resting state)
    let raf = 0
    let t0 = 0
    let lastReport = ''

    const report = (current: number | null, merged: number) => {
      const key = `${current}|${merged}`
      if (key === lastReport) return
      lastReport = key
      onStepRef.current(current, merged)
    }

    function draw(t: number) {
      let merged = 0
      let current: number | null = null
      branches.forEach((b, i) => {
        const local = (t - i * PER_PR) / TRAVEL
        const u = Math.max(0, Math.min(1, local))
        b.path.setAttribute('stroke-dashoffset', String(b.len * (1 - u)))
        b.path.setAttribute('opacity', u > 0 ? '0.95' : '0.16')
        b.label.setAttribute('opacity', u > 0 ? '1' : '0.3')
        if (local > 0 && local < 1) {
          const pt = b.path.getPointAtLength(b.len * u)
          b.dot.setAttribute('cx', String(pt.x))
          b.dot.setAttribute('cy', String(pt.y))
          b.dot.setAttribute('opacity', '1')
        } else {
          b.dot.setAttribute('opacity', '0')
        }
        const done = local >= 1
        b.node.setAttribute('fill', done ? b.color : VIZ.ink)
        b.node.setAttribute('stroke', done ? b.color : 'rgba(255,255,255,0.25)')
        b.node.setAttribute('r', done && local < 1.4 ? '7' : '5')
        if (done) merged = i + 1
        if (local >= 0 && local < 1.4) current = b.pr.number
      })
      report(Number.isFinite(t) ? current : null, merged)
    }

    function layout() {
      const w = wrap!.clientWidth
      if (!w) return
      const H = 104
      const y = 76
      const x0 = 12
      const x1 = w - 12
      svg!.setAttribute('viewBox', `0 0 ${w} ${H}`)
      svg!.setAttribute('height', String(H))
      svg!.replaceChildren()
      svgEl('line', { x1: x0, y1: y, x2: x1, y2: y, stroke: 'rgba(255,255,255,0.18)', 'stroke-width': 2 }, svg!)
      svgEl('text', { x: x0, y: y + 22, fill: VIZ.dim, 'font-family': VIZ.mono, 'font-size': 11 }, svg!).textContent = 'main'
      const span = (x1 - x0) / (prs.length + 0.6)
      const arc = Math.min(span * 0.72, 130)
      branches = prs.map((pr, i) => {
        const color = TYPE_COLOR[parseTitle(pr.title).type] ?? OTHER_COLOR
        const xe = x0 + span * (i + 1.1)
        const xs = xe - arc
        const path = svgEl('path', {
          d: `M${xs} ${y} C${xs + 10} ${y - 60}, ${xe - 26} ${y - 60}, ${xe} ${y}`,
          fill: 'none', stroke: color, 'stroke-width': 2, 'stroke-linecap': 'round',
        }, svg!)
        const len = path.getTotalLength()
        path.setAttribute('stroke-dasharray', String(len))
        const label = svgEl('text', { x: (xs + xe) / 2, y: y - 54, 'text-anchor': 'middle', fill: color, 'font-family': VIZ.mono, 'font-size': 11.5 }, svg!)
        label.textContent = `#${pr.number}`
        const node = svgEl('circle', { cx: xe, cy: y, r: 5, 'stroke-width': 2 }, svg!)
        const dot = svgEl('circle', { r: 4.5, fill: color, opacity: 0 }, svg!)
        return { pr, path, len, label, node, dot, color }
      })
      draw(time)
    }

    function tick(now: number) {
      if (!t0) t0 = now
      time = (now - t0) / 1000
      if (time < prs.length * PER_PR + 0.4) {
        draw(time)
        raf = requestAnimationFrame(tick)
      } else {
        time = Infinity
        draw(time)
      }
    }

    function play() {
      cancelAnimationFrame(raf)
      if (reduced) {
        time = Infinity
        draw(time)
        return
      }
      t0 = 0
      time = 0
      raf = requestAnimationFrame(tick)
    }

    layout()
    const resize = new ResizeObserver(layout)
    resize.observe(wrap)
    const seen = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        seen.disconnect()
        play()
      },
      { threshold: 0.6 },
    )
    if (replays > 0) play()
    else seen.observe(wrap)
    return () => {
      cancelAnimationFrame(raf)
      resize.disconnect()
      seen.disconnect()
    }
  }, [prs, replays])

  return (
    <div ref={wrapRef} className="relative">
      <svg ref={svgRef} aria-hidden="true" className="block w-full" />
      <button
        type="button"
        onClick={() => setReplays((n) => n + 1)}
        className="absolute bottom-0 right-0 rounded-full border border-white/15 px-2.5 py-1 font-mono text-[10.5px] text-zinc-400 transition-colors hover:border-accent/60 hover:text-white"
      >
        Replay merges
      </button>
    </div>
  )
}
