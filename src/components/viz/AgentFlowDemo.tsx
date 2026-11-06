import WindowFrame from '../ui/WindowFrame'
import { lerp, svgEl, VIZ } from './shared'
import { useDemo, type Demo } from './useDemo'

type NodeId = 'ingest' | 'cve' | 'rag' | 'analyze' | 'eval' | 'report'

const NODES: Record<NodeId, { x: number; y: number; label: [string, string]; gate?: boolean }> = {
  ingest: { x: 52, y: 50, label: ['ingest', 'agent'] },
  cve: { x: 52, y: 160, label: ['CVE', 'parser'] },
  rag: { x: 165, y: 105, label: ['RAG', 'engine'] },
  analyze: { x: 278, y: 40, label: ['analyze', 'agent'] },
  eval: { x: 278, y: 105, label: ['eval', 'gate'], gate: true },
  report: { x: 278, y: 170, label: ['report', 'agent'] },
}
const EDGES: [NodeId, NodeId][] = [['ingest', 'rag'], ['cve', 'rag'], ['rag', 'analyze'], ['analyze', 'eval'], ['eval', 'report']]
const LOOP = 5.4
const FLIGHTS: { a: NodeId; b: NodeId; s: number; e: number; chunk?: boolean }[] = [
  { a: 'ingest', b: 'rag', s: 0, e: 0.9 },
  { a: 'cve', b: 'rag', s: 0.35, e: 1.15, chunk: true },
  { a: 'cve', b: 'rag', s: 0.6, e: 1.4, chunk: true },
  { a: 'cve', b: 'rag', s: 0.85, e: 1.65, chunk: true },
  { a: 'rag', b: 'analyze', s: 1.75, e: 2.5 },
  { a: 'analyze', b: 'eval', s: 2.55, e: 3.15 },
  { a: 'eval', b: 'report', s: 3.25, e: 3.9 },
]
const ARRIVALS: Partial<Record<NodeId, number[]>> = { ingest: [0], rag: [0.9, 1.15, 1.4, 1.65], analyze: [2.5], eval: [3.15], report: [3.9] }
const STATUS: [number, string][] = [
  [0.9, '→ query in: “Which of our services does this CVE affect?”'],
  [1.7, '↳ retrieve: top chunks from live NVD data in ChromaDB'],
  [2.5, '↳ route: RAG engine → analyze agent'],
  [3.2, '↳ eval gate: relevance ✓ accuracy ✓ safety ✓'],
  [LOOP, '✓ report: structured JSON returned'],
]
const EDGE_IDLE = 'rgba(255,255,255,0.13)'
const NODE_IDLE = 'rgba(255,255,255,0.28)'

function createAgentFlow(root: HTMLDivElement): Demo {
  const svg = root.querySelector('svg')!
  const status = root.querySelector<HTMLElement>('[data-status]')!
  const edges = new Map<string, SVGLineElement>()
  for (const [a, b] of EDGES) {
    edges.set(a + b, svgEl('line', { x1: NODES[a].x, y1: NODES[a].y, x2: NODES[b].x, y2: NODES[b].y, stroke: EDGE_IDLE, 'stroke-width': 1.4 }, svg))
  }
  const shapes = new Map<NodeId, SVGElement>()
  for (const id of Object.keys(NODES) as NodeId[]) {
    const n = NODES[id]
    const g = svgEl('g', {}, svg)
    const shape = n.gate
      ? svgEl('rect', { x: n.x - 17, y: n.y - 17, width: 34, height: 34, rx: 4, transform: `rotate(45 ${n.x} ${n.y})`, fill: VIZ.ink, stroke: NODE_IDLE, 'stroke-width': 1.3 }, g)
      : svgEl('circle', { cx: n.x, cy: n.y, r: 24, fill: VIZ.ink, stroke: NODE_IDLE, 'stroke-width': 1.3 }, g)
    n.label.forEach((t, i) => {
      const text = svgEl('text', { x: n.x, y: n.y + (i ? 9 : -2), 'text-anchor': 'middle', 'font-family': VIZ.mono, 'font-size': i ? 7.5 : 8.5, fill: i ? VIZ.dim : VIZ.fg }, g)
      text.textContent = t
    })
    shapes.set(id, shape)
  }
  svgEl('text', { x: 165, y: 146, 'text-anchor': 'middle', 'font-family': VIZ.mono, 'font-size': 7.5, fill: VIZ.dim }, svg).textContent = 'ChromaDB'
  const dots = FLIGHTS.map((f) => svgEl('circle', { r: 4, fill: f.chunk ? VIZ.cyan : VIZ.violetSoft, opacity: 0 }, svg))
  let lastLine = ''

  return {
    frame(now) {
      const t = (now / 1000) % LOOP
      edges.forEach((e) => e.setAttribute('stroke', EDGE_IDLE))
      FLIGHTS.forEach((f, i) => {
        const inFlight = t >= f.s && t <= f.e
        dots[i].setAttribute('opacity', inFlight ? '1' : '0')
        if (!inFlight) return
        const u = (t - f.s) / (f.e - f.s)
        const eased = u * u * (3 - 2 * u)
        dots[i].setAttribute('cx', String(lerp(NODES[f.a].x, NODES[f.b].x, eased)))
        dots[i].setAttribute('cy', String(lerp(NODES[f.a].y, NODES[f.b].y, eased)))
        edges.get(f.a + f.b)!.setAttribute('stroke', f.chunk ? 'rgba(94,230,255,0.5)' : 'rgba(185,176,255,0.55)')
      })
      shapes.forEach((shape, id) => {
        const lit = (ARRIVALS[id] ?? []).some((a) => t >= a && t <= a + (id === 'report' ? 1.4 : 0.55))
        shape.setAttribute('stroke', lit ? (id === 'eval' ? VIZ.cyan : VIZ.violet) : NODE_IDLE)
        shape.setAttribute('stroke-width', lit ? '2.4' : '1.3')
      })
      const line = STATUS.find(([until]) => t < until)![1]
      if (line !== lastLine) {
        status.textContent = line
        lastLine = line
      }
    },
    still() {
      dots.forEach((d) => d.setAttribute('opacity', '0'))
      edges.forEach((e) => e.setAttribute('stroke', 'rgba(185,176,255,0.45)'))
      shapes.forEach((s) => {
        s.setAttribute('stroke', VIZ.violet)
        s.setAttribute('stroke-width', '1.8')
      })
      lastLine = ''
      status.textContent = 'query → retrieve → analyze → eval gate → report'
    },
    destroy() {
      svg.replaceChildren()
    },
  }
}

/** CyberSentinel: a query flowing through the five agents and the eval gate */
export default function AgentFlowDemo({ caption }: { caption: string }) {
  const { ref } = useDemo(createAgentFlow)
  return (
    <div ref={ref} className="space-y-3">
      <WindowFrame caption={caption}>
        <svg
          viewBox="0 0 330 210"
          preserveAspectRatio="xMidYMid meet"
          className="h-full w-full"
          role="img"
          aria-label="A query flows from the ingest agent through the RAG engine, the analyze agent and the eval gate to the report agent, while the CVE parser feeds retrieved chunks into the RAG engine"
        />
      </WindowFrame>
      <p data-status className="min-h-[2.6em] font-mono text-[11px] leading-relaxed text-zinc-400" />
    </div>
  )
}
