import WindowFrame from '../ui/WindowFrame'
import { clamp, fitCanvas, lerp, mulberry32, VIZ } from './shared'
import { useDemo, type Demo } from './useDemo'

const K = 4
const COLORS = [VIZ.violet, VIZ.cyan, VIZ.amber, VIZ.rose]
const BLOBS: [number, number][] = [[0.24, 0.3], [0.72, 0.26], [0.3, 0.74], [0.76, 0.7]]

type Pt = { x: number; y: number; a: number }
type Centroid = { x: number; y: number }

function createKMeans(root: HTMLDivElement): Demo {
  const canvas = root.querySelector('canvas')!
  const status = root.querySelector<HTMLElement>('[data-status]')!
  const rand = mulberry32(7)
  const gauss = () => {
    let u = 0
    let v = 0
    while (!u) u = rand()
    while (!v) v = rand()
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
  }
  // Synthetic customers in four loose groups: monthly spend (x) against visits (y)
  const pts: Pt[] = Array.from({ length: 140 }, (_, i) => {
    const [bx, by] = BLOBS[i % 4]
    return { x: clamp(bx + gauss() * 0.085, 0.03, 0.97), y: clamp(by + gauss() * 0.085, 0.05, 0.95), a: -1 }
  })
  const pick = mulberry32(99)
  let target: Centroid[] = []
  let shown: Centroid[] = []
  let iter = 0
  let converged = false
  let inertia = 0
  let nextAt = 0
  let holdUntil = 0

  function reset() {
    const idx = new Set<number>()
    while (idx.size < K) idx.add(Math.floor(pick() * pts.length))
    target = [...idx].map((i) => ({ x: pts[i].x, y: pts[i].y }))
    shown = target.map((c) => ({ ...c }))
    pts.forEach((p) => (p.a = -1))
    iter = 0
    converged = false
    inertia = 0
  }

  // One Lloyd iteration: assign every point to its nearest centroid, then move centroids to their means
  function step() {
    inertia = 0
    for (const p of pts) {
      let best = 0
      let bestD = Infinity
      target.forEach((c, j) => {
        const d = (p.x - c.x) ** 2 + (p.y - c.y) ** 2
        if (d < bestD) {
          bestD = d
          best = j
        }
      })
      p.a = best
      inertia += bestD
    }
    let moved = 0
    target = target.map((c, j) => {
      const mine = pts.filter((p) => p.a === j)
      if (!mine.length) return c
      const nx = mine.reduce((s, p) => s + p.x, 0) / mine.length
      const ny = mine.reduce((s, p) => s + p.y, 0) / mine.length
      moved = Math.max(moved, Math.hypot(nx - c.x, ny - c.y))
      return { x: nx, y: ny }
    })
    iter++
    if (moved < 1e-4) converged = true
  }

  function draw() {
    const { ctx, w, h } = fitCanvas(canvas)
    ctx.clearRect(0, 0, w, h)
    const X = (v: number) => 10 + v * (w - 20)
    const Y = (v: number) => 10 + v * (h - 24)
    ctx.font = `9.5px ${VIZ.mono}`
    ctx.fillStyle = VIZ.dim
    ctx.textAlign = 'right'
    ctx.fillText('monthly spend →', w - 8, h - 6)
    ctx.textAlign = 'left'
    ctx.fillText('↑ visits', 8, 14)
    for (const p of pts) {
      ctx.fillStyle = p.a < 0 ? 'rgba(255,255,255,0.35)' : COLORS[p.a]
      ctx.globalAlpha = p.a < 0 ? 1 : 0.85
      ctx.beginPath()
      ctx.arc(X(p.x), Y(p.y), 2.6, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1
    shown.forEach((c, j) => {
      const x = X(c.x)
      const y = Y(c.y)
      ctx.strokeStyle = COLORS[j]
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(x, y, 9, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(x - 5, y)
      ctx.lineTo(x + 5, y)
      ctx.moveTo(x, y - 5)
      ctx.lineTo(x, y + 5)
      ctx.stroke()
    })
    status.textContent = `k = 4 · iteration ${iter} · inertia ${inertia.toFixed(3)}${converged ? ' · converged ✓' : ''}`
  }

  const onResize = () => draw()
  window.addEventListener('resize', onResize)
  reset()

  return {
    frame(now) {
      if (!nextAt) nextAt = now + 700
      if (converged) {
        // hold the finished fit for a moment, then start a fresh run
        if (!holdUntil) holdUntil = now + 2600
        else if (now > holdUntil) {
          reset()
          holdUntil = 0
          nextAt = now + 700
        }
      } else if (now >= nextAt) {
        step()
        nextAt = now + 850
      }
      shown.forEach((c, j) => {
        c.x = lerp(c.x, target[j].x, 0.12)
        c.y = lerp(c.y, target[j].y, 0.12)
      })
      draw()
    },
    still() {
      // a finished fit, computed instantly
      reset()
      for (let i = 0; i < 30 && !converged; i++) step()
      shown = target.map((c) => ({ ...c }))
      holdUntil = 0
      nextAt = 0
      draw()
    },
    destroy() {
      window.removeEventListener('resize', onResize)
    },
  }
}

/** Spending & Churn: k-means grouping customers into segments, running live */
export default function KMeansDemo({ caption }: { caption: string }) {
  const { ref } = useDemo(createKMeans)
  return (
    <div ref={ref} className="space-y-3">
      <WindowFrame caption={caption}>
        <canvas className="block h-full w-full" role="img" aria-label="Customer points grouping into four segments as k-means runs" />
      </WindowFrame>
      <p data-status className="min-h-[2.6em] font-mono text-[11px] leading-relaxed text-zinc-400" />
    </div>
  )
}
