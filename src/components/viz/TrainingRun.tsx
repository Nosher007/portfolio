import { useEffect, useRef } from 'react'
import { useActiveSection } from '../../hooks/useActiveSection'
import { SECTIONS } from '../../lib/sections'
import { clamp, fitCanvas, lerp, mulberry32, VIZ } from './shared'

const SECTION_IDS = SECTIONS.map((s) => s.id)
const N = 400
const STEPS = 4000
const EPOCHS = 40
const YMAX = 3.4

// A made-up but typical-looking run: fast early drop, long tail, validation a little above train
const shape = (t: number) => {
  const s = t * STEPS
  return 2.31 * Math.exp(-s / 520) + 0.62 * Math.exp(-s / 2600) + 0.18
}
const TRAIN: number[] = []
const VAL: number[] = []
{
  const rand = mulberry32(42)
  let smooth = 0
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1)
    TRAIN.push(shape(t) * (1 + (rand() - 0.5) * 0.09))
    const v = shape(t) * 1.06 + 0.05 + (rand() - 0.5) * 0.02
    smooth = i ? smooth * 0.7 + v * 0.3 : v
    VAL.push(smooth)
  }
}
const at = (arr: number[], p: number) => {
  const f = p * (N - 1)
  const i = Math.floor(f)
  return lerp(arr[i], arr[Math.min(N - 1, i + 1)], f - i)
}

type Mark = { f: number; label: string }

function drawRun(canvas: HTMLCanvasElement | null, p: number, marks: Mark[]) {
  const detailed = canvas ? canvas.clientWidth >= 90 : false
  if (!canvas || !canvas.clientWidth) return
  const { ctx, w, h } = fitCanvas(canvas)
  const pad = detailed ? 4 : 2
  const X = (t: number) => pad + t * (w - pad * 2)
  const Y = (v: number) => pad + (1 - v / YMAX) * (h - pad * 2)
  ctx.clearRect(0, 0, w, h)
  if (detailed) {
    marks.forEach((m) => {
      ctx.setLineDash([2, 3])
      ctx.strokeStyle = m.f <= p + 0.002 ? 'rgba(185,176,255,0.5)' : 'rgba(255,255,255,0.1)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(X(m.f), 0)
      ctx.lineTo(X(m.f), h)
      ctx.stroke()
    })
    ctx.setLineDash([])
  }
  const trace = (arr: number[], upto: number) => {
    ctx.beginPath()
    for (let i = 0; i <= Math.floor(upto * (N - 1)); i++) {
      const x = X(i / (N - 1))
      const y = Y(arr[i])
      if (i) ctx.lineTo(x, y)
      else ctx.moveTo(x, y)
    }
    if (upto > 0) ctx.lineTo(X(upto), Y(at(arr, upto)))
  }
  ctx.lineJoin = 'round'
  ctx.lineWidth = 1
  ctx.strokeStyle = 'rgba(255,255,255,0.12)'
  trace(TRAIN, 1)
  ctx.stroke()
  ctx.lineWidth = detailed ? 1.4 : 1.2
  ctx.strokeStyle = VIZ.cyan
  trace(VAL, p)
  ctx.stroke()
  ctx.lineWidth = detailed ? 1.8 : 1.5
  ctx.strokeStyle = VIZ.violet
  trace(TRAIN, p)
  ctx.stroke()
  ctx.fillStyle = VIZ.fg
  ctx.beginPath()
  ctx.arc(X(p), Y(at(TRAIN, p)), detailed ? 2.6 : 2, 0, Math.PI * 2)
  ctx.fill()
}

/**
 * The page as a training run: scroll progress drives a loss curve, and each
 * section is a checkpoint. Decorative, so hidden from screen readers.
 */
export default function TrainingRun() {
  const active = useActiveSection(SECTION_IDS)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const statsRef = useRef<HTMLSpanElement>(null)
  const ckptRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let marks: Mark[] = []
    let queued = false
    const maxScroll = () => Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    const measure = () => {
      const max = maxScroll()
      marks = [
        { f: 0, label: 'ckpt-00 · init' },
        ...SECTIONS.map((s, i) => {
          const el = document.getElementById(s.id)
          // reached once the section is ~45% up the screen, the same rule the navbar uses
          const top = el ? el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.45 : 0
          return { f: clamp(top / max, 0, 1), label: `ckpt-0${i + 1} · ${s.id}` }
        }),
      ]
    }
    const update = () => {
      queued = false
      const p = clamp(window.scrollY / maxScroll(), 0, 1)
      let mark = marks[0]
      for (const m of marks) if (m.f <= p + 0.002) mark = m
      const label = p > 0.985 ? `${mark.label} · converged` : mark.label
      const epoch = `${Math.min(EPOCHS, 1 + Math.floor(p * EPOCHS))}/${EPOCHS}`
      const loss = at(TRAIN, p).toFixed(3)
      const val = at(VAL, p).toFixed(3)
      drawRun(canvasRef.current, p, marks)
      const wide = window.innerWidth >= 640
      if (statsRef.current) {
        statsRef.current.textContent = wide
          ? `epoch ${epoch} · loss ${loss} · val ${val}`
          : `ep ${epoch} · loss ${loss} · ${label.split(' · ')[0]}`
      }
      if (ckptRef.current) ckptRef.current.textContent = label
    }
    const schedule = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(update)
    }
    const remeasure = () => {
      measure()
      schedule()
    }
    remeasure()
    window.addEventListener('scroll', schedule, { passive: true })
    const resize = new ResizeObserver(remeasure)
    resize.observe(document.body)
    return () => {
      window.removeEventListener('scroll', schedule)
      resize.disconnect()
    }
  }, [])

  const shown = active !== null

  return (
    // A slim status strip under the navbar: it never sits on top of what you're reading
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed left-1/2 top-[80px] z-40 flex h-8 w-[min(580px,calc(100%-32px))] -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-ink-950/80 px-3 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all duration-500 ${
        shown ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
      }`}
    >
      <span className="hidden flex-shrink-0 font-mono text-[10px] text-zinc-500 sm:inline">train.log</span>
      <canvas ref={canvasRef} className="block h-[18px] w-[72px] flex-shrink-0 sm:w-[96px]" />
      <span ref={statsRef} className="min-w-0 truncate font-mono text-[10px] tabular-nums text-zinc-400" />
      <span ref={ckptRef} className="ml-auto hidden flex-shrink-0 font-mono text-[10px] text-accent-cyan sm:inline" />
    </div>
  )
}
