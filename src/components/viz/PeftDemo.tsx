import { useEffect, useState } from 'react'
import WindowFrame from '../ui/WindowFrame'
import { svgEl, VIZ } from './shared'
import { useDemo, type Demo } from './useDemo'

type Method = 'lora' | 'adapter' | 'prefix' | 'full'

const METHODS: { id: Method; label: string; text: string; share: number }[] = [
  { id: 'lora', label: 'LoRA', text: 'Low-rank A·B matrices beside each block learn. The base model stays frozen.', share: 4 },
  { id: 'adapter', label: 'Adapter', text: 'Small bottleneck layers between the blocks learn. The base model stays frozen.', share: 6 },
  { id: 'prefix', label: 'Prefix', text: 'Learned prefix vectors sit in front of the input. Nothing inside the model changes.', share: 2 },
  { id: 'full', label: 'Full FT', text: 'Every weight updates. This is the baseline the thesis compares against.', share: 100 },
]

interface PeftDemo extends Demo {
  setMethod(m: Method): void
}

const BX = 82
const BW = 150
const BH = 16
/** How strongly a sweep at position x lights a part at position pos (both 0 = input … 1 = output) */
const bump = (x: number, pos: number) => Math.max(0, 1 - Math.abs(x - pos) * 5)

function createPeft(root: HTMLDivElement): PeftDemo {
  const svg = root.querySelector('svg')!
  let method: Method = 'lora'
  type Part = { pos: number; node: SVGElement }
  const blocks: Part[] = []
  const loras: Part[] = []
  const adapters: Part[] = []
  const prefixes: Part[] = []

  svgEl('text', { x: BX + BW / 2, y: 18, 'text-anchor': 'middle', 'font-family': VIZ.mono, 'font-size': 8.5, fill: VIZ.dim }, svg).textContent =
    '↑ answer · medical / legal QA'
  for (let i = 0; i < 6; i++) {
    const y = 166 - i * 24
    const pos = (i + 1) / 7
    svgEl('text', { x: BX - 8, y: y + 11, 'text-anchor': 'end', 'font-family': VIZ.mono, 'font-size': 8, fill: VIZ.dim }, svg).textContent = `block ${i + 1}`
    blocks.push({ pos, node: svgEl('rect', { x: BX, y, width: BW, height: BH, rx: 3, fill: 'rgba(255,255,255,0.06)', stroke: 'rgba(255,255,255,0.18)', 'stroke-width': 1 }, svg) })
    const lora = svgEl('g', {}, svg)
    svgEl('rect', { x: BX + BW + 10, y: y + 1, width: 5, height: BH - 2, rx: 1.5, fill: VIZ.cyan }, lora)
    svgEl('rect', { x: BX + BW + 18, y: y + 6, width: 18, height: 4, rx: 1.5, fill: VIZ.cyan }, lora)
    loras.push({ pos, node: lora })
    adapters.push({ pos: pos + 0.07, node: svgEl('rect', { x: BX + BW / 2 - 20, y: y - 6, width: 40, height: 4, rx: 2, fill: VIZ.cyan }, svg) })
  }
  for (let i = 0; i < 7; i++) svgEl('rect', { x: BX + 10 + i * 19, y: 180, width: 11, height: 7, rx: 1.5, fill: 'rgba(255,255,255,0.18)' }, svg)
  for (let i = 0; i < 3; i++) prefixes.push({ pos: 0, node: svgEl('rect', { x: 18 + i * 16, y: 180, width: 11, height: 7, rx: 1.5, fill: VIZ.cyan }, svg) })
  svgEl('text', { x: BX + BW / 2, y: 198, 'text-anchor': 'middle', 'font-family': VIZ.mono, 'font-size': 8, fill: VIZ.dim }, svg).textContent = 'input tokens'
  const passLabel = svgEl('text', { x: 306, y: 104, 'text-anchor': 'middle', 'font-family': VIZ.mono, 'font-size': 8, fill: VIZ.dim, transform: 'rotate(90 306 104)' }, svg)

  // fwd / back: where the forward and backward sweeps are (-1 = not running)
  function paint(fwd: number, back: number, label: string) {
    for (const b of blocks) {
      if (method === 'full') {
        b.node.setAttribute('fill', `rgba(94,230,255,${(0.22 + 0.55 * bump(back, b.pos)).toFixed(3)})`)
        b.node.setAttribute('stroke', 'rgba(94,230,255,0.6)')
      } else {
        b.node.setAttribute('fill', `rgba(255,255,255,${(0.05 + 0.13 * bump(fwd, b.pos)).toFixed(3)})`)
        b.node.setAttribute('stroke', 'rgba(255,255,255,0.18)')
      }
    }
    const show = (parts: Part[], on: boolean) =>
      parts.forEach((p) => p.node.setAttribute('opacity', on ? (0.45 + 0.55 * bump(back, p.pos)).toFixed(3) : '0'))
    show(loras, method === 'lora')
    show(adapters, method === 'adapter')
    show(prefixes, method === 'prefix')
    passLabel.textContent = label
  }

  const still = () => paint(-1, -1, 'trainable')
  return {
    frame(now) {
      const phase = (now % 2800) / 2800
      if (phase < 0.5) paint(phase / 0.5, -1, 'forward ↑')
      else paint(-1, 1 - (phase - 0.5) / 0.5, 'backward ↓')
    },
    still,
    setMethod(m) {
      method = m
      still()
    },
    destroy() {
      svg.replaceChildren()
    },
  }
}

/** PEFT thesis: frozen blocks, with only the chosen method's small parts training */
export default function PeftDemo({ caption }: { caption: string }) {
  const { ref, demoRef } = useDemo(createPeft)
  const [method, setMethod] = useState<Method>('lora')
  const current = METHODS.find((m) => m.id === method)!

  useEffect(() => {
    demoRef.current?.setMethod(method)
  }, [method, demoRef])

  return (
    <div ref={ref} className="space-y-3">
      <WindowFrame caption={caption}>
        <svg
          viewBox="0 0 330 210"
          preserveAspectRatio="xMidYMid meet"
          className="h-full w-full"
          role="img"
          aria-label={`Six frozen transformer blocks. With ${current.label}, only the small trainable parts light up during the backward pass.`}
        />
      </WindowFrame>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Fine-tuning method">
        {METHODS.map((m) => (
          <button
            key={m.id}
            type="button"
            aria-pressed={method === m.id}
            onClick={() => setMethod(m.id)}
            className={`min-h-[32px] rounded-full border px-3 font-mono text-[11px] transition-colors ${
              method === m.id
                ? 'border-transparent bg-accent-soft text-ink-950'
                : 'border-white/15 text-zinc-400 hover:border-accent/60 hover:text-white'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
      <p className="min-h-[2.6em] font-mono text-[11px] leading-relaxed text-zinc-400">{current.text}</p>
      <div className="space-y-1.5">
        <p className="font-mono text-[10px] text-zinc-500">Share of weights updated (rough, not to scale)</p>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
          <div
            className="h-full min-w-[4px] rounded-full bg-gradient-to-r from-accent to-accent-cyan transition-[width] duration-500"
            style={{ width: `${current.share}%` }}
          />
        </div>
      </div>
    </div>
  )
}
