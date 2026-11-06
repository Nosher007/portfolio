/** Colours and helpers shared by the live project diagrams (kept in step with tailwind.config.js) */
export const VIZ = {
  ink: '#07070b',
  fg: '#e7e7f0',
  dim: '#63637c',
  violet: '#8b7cff',
  violetSoft: '#b9b0ff',
  cyan: '#5ee6ff',
  amber: '#ffc26b',
  rose: '#ff8fb1',
  line: 'rgba(255,255,255,0.08)',
  mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
}

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** Small deterministic PRNG so the visuals look the same on every visit */
export function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const SVGNS = 'http://www.w3.org/2000/svg'
export function svgEl<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number>,
  parent?: Element,
): SVGElementTagNameMap[K] {
  const node = document.createElementNS(SVGNS, tag)
  for (const k in attrs) node.setAttribute(k, String(attrs[k]))
  if (parent) parent.appendChild(node)
  return node
}

/** Match a canvas's backing store to its CSS size and return a ready 2D context */
export function fitCanvas(canvas: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const w = canvas.clientWidth
  const h = canvas.clientHeight
  if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
  }
  const ctx = canvas.getContext('2d')!
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  return { ctx, w, h }
}
