import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react'
import { svgEl, VIZ } from './shared'

const PARAGRAPHS = [
  "I'm a software engineer who builds production AI services and delivers them directly with the people who use them.",
  'At Buggcy I shipped 25+ Python and JavaScript services across 4 client engagements, embedded with each customer team from requirements through production. At URBN I deployed and monitored ML across 7 production systems on GCP, from fine-tuning transformers on Vertex AI to drift-triggered retraining in Airflow.',
  "I also build and run CyberSentinel, a multi-agent LLM platform with RAG, a 332-test evaluation suite, and responsible-AI safeguards as release gates. I'm finishing my MS in Data Science at Drexel, with a thesis on parameter-efficient fine-tuning.",
]

/** Which words each word "attends to", strongest first. Hand-tuned for illustration, not from a model. */
const ATTENDS: Record<string, string[]> = {
  builds: ['production', 'services', 'shipped'],
  production: ['services', 'systems', 'deployed', 'monitored'],
  services: ['production', 'delivers', 'shipped', 'people'],
  delivers: ['people', 'services', 'customer'],
  people: ['delivers', 'customer', 'use'],
  buggcy: ['shipped', 'client', 'services'],
  shipped: ['services', 'python', 'javascript', 'engagements'],
  engagements: ['client', 'customer', 'shipped'],
  customer: ['client', 'team', 'people'],
  urbn: ['deployed', 'systems', 'gcp'],
  deployed: ['production', 'monitored', 'systems', 'gcp'],
  monitored: ['drift-triggered', 'deployed', 'ml'],
  ml: ['transformers', 'monitored', 'retraining'],
  systems: ['production', 'gcp', '7'],
  gcp: ['vertex', 'systems', 'urbn'],
  'fine-tuning': ['transformers', 'vertex', 'parameter-efficient', 'ml'],
  transformers: ['fine-tuning', 'ml', 'vertex'],
  vertex: ['gcp', 'fine-tuning', 'transformers'],
  'drift-triggered': ['retraining', 'monitored', 'airflow'],
  retraining: ['drift-triggered', 'airflow', 'ml', 'monitored'],
  airflow: ['retraining', 'drift-triggered'],
  cybersentinel: ['multi-agent', 'rag', 'evaluation', 'safeguards'],
  'multi-agent': ['llm', 'cybersentinel', 'rag'],
  llm: ['multi-agent', 'rag', 'platform'],
  rag: ['llm', 'multi-agent', 'cybersentinel'],
  evaluation: ['332-test', 'safeguards', 'release'],
  safeguards: ['responsible-ai', 'release', 'evaluation'],
  thesis: ['parameter-efficient', 'fine-tuning', 'drexel'],
  'parameter-efficient': ['fine-tuning', 'thesis', 'transformers'],
}
const WEIGHTS = [0.95, 0.7, 0.5, 0.32]
const ATTENDED = new Set(Object.values(ATTENDS).flat())

type Token = { i: number; word: string; punct: string; key: string }
let counter = 0
const TOKENS: Token[][] = PARAGRAPHS.map((p) =>
  p.split(' ').map((raw) => {
    const [, word, punct] = raw.match(/^(.*?)([.,]?)$/)!
    return { i: counter++, word, punct, key: word.toLowerCase() }
  }),
)
const ALL = TOKENS.flat()
const DEMO_INDEX = ALL.find((t) => t.key === 'retraining')!.i

const weightFor = (activeKey: string | null, key: string) => {
  if (!activeKey) return 0
  const rank = ATTENDS[activeKey].indexOf(key)
  return rank < 0 ? 0 : (WEIGHTS[rank] ?? 0.25)
}

/** About text where hovering a word draws attention-map arcs to the words it relates to */
export default function AttentionText() {
  const boxRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const touched = useRef(false)
  const [active, setActive] = useState<number | null>(null)
  const activeKey = active === null ? null : ALL[active].key

  const pick = (i: number) => {
    touched.current = true
    setActive(i)
  }

  // Draw the arcs from the active word to every word it attends to
  useEffect(() => {
    const box = boxRef.current
    const svg = svgRef.current
    if (!box || !svg) return
    const draw = () => {
      svg.replaceChildren()
      if (active === null) return
      const src = box.querySelector(`[data-i="${active}"]`)
      if (!src) return
      const key = ALL[active].key
      const br = box.getBoundingClientRect()
      const sr = src.getBoundingClientRect()
      const sx = sr.left + sr.width / 2 - br.left
      const sy = sr.top - br.top + 5
      ATTENDS[key].forEach((target, rank) => {
        const w = WEIGHTS[rank] ?? 0.25
        box.querySelectorAll(`[data-k="${CSS.escape(target)}"]`).forEach((t) => {
          const tr = t.getBoundingClientRect()
          const tx = tr.left + tr.width / 2 - br.left
          const ty = tr.top - br.top + 5
          const lift = 16 + Math.min(54, Math.abs(tx - sx) * 0.22 + Math.abs(ty - sy) * 0.15)
          const cy = Math.min(sy, ty) - lift
          svgEl('path', {
            d: `M${sx.toFixed(1)} ${sy.toFixed(1)} Q${((sx + tx) / 2).toFixed(1)} ${cy.toFixed(1)} ${tx.toFixed(1)} ${ty.toFixed(1)}`,
            fill: 'none',
            stroke: `rgba(94,230,255,${(0.25 + w * 0.7).toFixed(3)})`,
            'stroke-width': (0.8 + w * 2.4).toFixed(2),
            'stroke-linecap': 'round',
          }, svg)
          svgEl('circle', { cx: tx.toFixed(1), cy: ty.toFixed(1), r: 2.6, fill: VIZ.cyan }, svg)
        })
      })
    }
    draw()
    window.addEventListener('resize', draw)
    document.fonts?.ready.then(draw)
    return () => window.removeEventListener('resize', draw)
  }, [active])

  // Play it once by itself the first time the paragraph is in view, so people notice it
  useEffect(() => {
    const box = boxRef.current
    if (!box || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let timer = 0
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        timer = window.setTimeout(() => {
          if (touched.current) return
          setActive(DEMO_INDEX)
          timer = window.setTimeout(() => {
            if (!touched.current) setActive(null)
          }, 3200)
        }, 700)
      },
      { threshold: 0.6 },
    )
    io.observe(box)
    return () => {
      io.disconnect()
      window.clearTimeout(timer)
    }
  }, [])

  // A tap anywhere else clears it on touch screens
  useEffect(() => {
    if (active === null) return
    const onDown = (e: PointerEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setActive(null)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [active])

  return (
    <div className="space-y-3">
      <div
        ref={boxRef}
        className="relative space-y-4 leading-[2.15]"
        onPointerLeave={(e) => {
          if (e.pointerType === 'mouse') setActive(null)
        }}
      >
        {TOKENS.map((para, pi) => (
          <p key={pi}>
            {para.map((t, j) => {
              const w = weightFor(activeKey, t.key)
              const base = 'whitespace-nowrap rounded-md px-[3px] -mx-[3px] transition-colors duration-200'
              let word: ReactNode = t.word
              if (ATTENDS[t.key]) {
                const isSource = t.i === active
                word = (
                  <span
                    data-i={t.i}
                    data-k={t.key}
                    onPointerEnter={(e) => {
                      if (e.pointerType === 'mouse') pick(t.i)
                    }}
                    onClick={() => pick(t.i)}
                    className={`${base} cursor-pointer ${
                      isSource
                        ? 'bg-accent-cyan text-ink-950'
                        : 'text-zinc-100 underline decoration-accent-soft/40 decoration-dotted decoration-2 underline-offset-[6px]'
                    }`}
                    style={!isSource && w ? { backgroundColor: `rgba(139,124,255,${(w * 0.42).toFixed(3)})` } : undefined}
                  >
                    {t.word}
                  </span>
                )
              } else if (ATTENDED.has(t.key)) {
                word = (
                  <span
                    data-k={t.key}
                    className={`${base} ${w ? 'text-zinc-100' : ''}`}
                    style={w ? { backgroundColor: `rgba(139,124,255,${(w * 0.42).toFixed(3)})` } : undefined}
                  >
                    {t.word}
                  </span>
                )
              }
              return (
                <Fragment key={t.i}>
                  {j > 0 && ' '}
                  {word}
                  {t.punct}
                </Fragment>
              )
            })}
          </p>
        ))}
        <svg ref={svgRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" />
      </div>
      <p className="font-mono text-[11px] leading-relaxed text-zinc-500">
        Hover or tap a dotted word to see what it attends to, like a transformer&apos;s attention map. Weights are
        hand-tuned for fun.
      </p>
    </div>
  )
}
