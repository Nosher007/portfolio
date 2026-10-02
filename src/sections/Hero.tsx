import { motion } from 'motion/react'
import CountUp from '../components/ui/CountUp'
import { SOCIALS } from '../lib/links'
import { RESUME_URL, scrollToSection } from '../lib/sections'

const stats = [
  { value: 7, label: 'production ML systems on GCP' },
  { value: 25, suffix: '+', label: 'services shipped for clients' },
  { value: 332, label: 'eval tests gating every release' },
  { value: 3.75, decimals: 2, label: 'GPA · MS Data Science' },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
}
const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-32 lg:pt-36">
      {/* Backdrop: blueprint grid + two soft glows */}
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0" />
      <div aria-hidden className="pointer-events-none absolute -left-40 top-10 h-[420px] w-[420px] rounded-full bg-accent/20 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute -right-32 top-40 h-[380px] w-[380px] rounded-full bg-accent-cyan/10 blur-[120px]" />

      <div className="relative mx-auto max-w-content px-5 sm:px-6">
        <div className="grid items-center gap-6 lg:grid-cols-[1.08fr_1fr] lg:gap-4">
          {/* Copy */}
          <motion.div variants={container} initial="hidden" animate="show" className="text-center lg:text-left">
            <motion.div variants={item} className="mb-6 flex justify-center lg:justify-start">
              <span className="inline-flex items-center gap-2.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3.5 py-1.5 font-mono text-[11px] text-emerald-200">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-emerald-400" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Open to full-time ML &amp; AI engineering roles
              </span>
            </motion.div>

            <motion.p variants={item} className="mb-4 font-mono text-xs text-zinc-500">
              MS Data Science · Drexel University · Bethesda, MD
            </motion.p>

            <motion.h1 variants={item} className="font-sora text-mega font-bold text-white">
              Nosherwan Babar
            </motion.h1>

            <motion.p variants={item} className="mt-5 font-sora text-xl font-semibold leading-snug text-zinc-200 sm:text-2xl">
              I build <span className="text-gradient animate-shimmer">production AI systems</span>: agents, RAG, and the
              MLOps that keeps them running.
            </motion.p>

            <motion.p variants={item} className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-zinc-400 lg:mx-0">
              Software engineer who ships LLM platforms and puts models into production. Most recently deployed and
              monitored ML across 7 production systems on GCP at URBN, and built CyberSentinel, a 5-agent RAG platform
              with a 332-test evaluation suite.
            </motion.p>

            <motion.div variants={item} className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <button type="button" onClick={() => scrollToSection('projects')} className="btn-primary">
                Explore my work
                <span aria-hidden>→</span>
              </button>
              <a href={RESUME_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                Resume ↗
              </a>
              <div className="ml-1 flex items-center gap-2">
                {SOCIALS.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-zinc-300 transition-all hover:-translate-y-0.5 hover:border-accent/60 hover:text-white"
                  >
                    <Icon size={17} />
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* The 3D network renders on top of this anchor (see Constellation) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-[340px] sm:max-w-[440px] lg:max-w-[540px]"
          >
            <div id="constellation-anchor" className="relative aspect-square w-full">
              <div
                aria-hidden
                className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle,rgba(139,124,255,0.28),rgba(94,230,255,0.08)_45%,transparent_70%)] blur-2xl"
              />
            </div>
            <p className="-mt-2 text-center font-mono text-[11px] text-zinc-500">
              <span className="text-accent-cyan">↳</span> click a node to explore
            </p>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="bg-ink-950/90 px-5 py-6 sm:px-7"
            >
              <p className="font-sora text-3xl font-bold tracking-tight text-white sm:text-4xl">
                <CountUp to={s.value} decimals={s.decimals} suffix={s.suffix} />
              </p>
              <p className="mt-1.5 font-mono text-[11px] leading-snug text-zinc-500">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
