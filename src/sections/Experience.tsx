import { motion } from 'motion/react'
import Reveal from '../components/ui/Reveal'
import SectionHeading from '../components/ui/SectionHeading'
import Spotlight from '../components/ui/Spotlight'
import { experiences } from '../data/experience'

export default function Experience() {
  return (
    <section id="experience" className="relative py-24 lg:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="mx-auto max-w-content px-5 sm:px-6">
        <SectionHeading index="02" label="Experience">
          Where I&apos;ve <span className="text-gradient">shipped.</span>
        </SectionHeading>

        <ol className="relative">
          {/* Timeline rail that draws itself as you scroll in */}
          <motion.span
            aria-hidden
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: '-120px' }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-4 left-[7px] top-3 w-px origin-top bg-gradient-to-b from-accent via-accent-cyan/60 to-transparent sm:left-[11px]"
          />

          {experiences.map((exp, i) => (
            <li key={exp.company} className="relative pb-12 pl-9 last:pb-0 sm:pl-14">
              <span aria-hidden className="absolute left-0 top-2 flex h-[15px] w-[15px] items-center justify-center sm:h-[23px] sm:w-[23px]">
                <span className="absolute h-full w-full rounded-full bg-accent/25" />
                <span className="h-[7px] w-[7px] rounded-full bg-accent-cyan shadow-[0_0_12px_#5ee6ff] sm:h-[9px] sm:w-[9px]" />
              </span>

              <Reveal delay={i * 0.08}>
                <Spotlight className="card p-6 transition-colors duration-300 hover:border-white/15 sm:p-8">
                  <p className="font-mono text-xs text-accent-soft">
                    {exp.startDate} — {exp.endDate}
                  </p>
                  <h3 className="mt-2 font-sora text-h4 font-semibold text-white">{exp.title}</h3>
                  <p className="mt-1 text-sm text-zinc-400">
                    {exp.company} <span className="text-zinc-600">·</span> {exp.location}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {exp.metrics.map((m) => (
                      <span key={m} className="chip border-accent/25 bg-accent/[0.07] text-accent-soft">
                        {m}
                      </span>
                    ))}
                  </div>

                  <ul className="mt-6 space-y-3">
                    {exp.bullets.map((b) => (
                      <li key={b} className="flex gap-3 text-[15px] leading-relaxed text-zinc-400">
                        <span aria-hidden className="mt-[9px] h-1 w-1 flex-shrink-0 rounded-full bg-zinc-500" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </Spotlight>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
