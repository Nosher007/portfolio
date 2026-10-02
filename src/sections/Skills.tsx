import Reveal from '../components/ui/Reveal'
import SectionHeading from '../components/ui/SectionHeading'
import Spotlight from '../components/ui/Spotlight'
import { skillGroups } from '../data/skills'

export default function Skills() {
  return (
    <section id="skills" className="relative py-24 lg:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="mx-auto max-w-content px-5 sm:px-6">
        <SectionHeading index="04" label="Skills">
          The <span className="text-gradient">toolkit.</span>
        </SectionHeading>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, i) => (
            <Reveal key={group.label} delay={i * 0.07} className={group.wide ? 'lg:col-span-2' : ''}>
              <Spotlight className="card h-full p-6 transition-colors duration-300 hover:border-white/15 sm:p-7">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-sora text-h4 font-semibold text-white">{group.label}</h3>
                  <span className="font-mono text-[11px] text-zinc-500">
                    {String(group.skills.length).padStart(2, '0')} tools
                  </span>
                </div>
                <p className="mt-2 text-sm text-zinc-500">{group.blurb}</p>
                <ul className="mt-6 flex flex-wrap gap-2.5">
                  {group.skills.map(({ name, Icon }) => (
                    <li
                      key={name}
                      className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-2 text-sm text-zinc-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-accent/[0.06] hover:text-white"
                    >
                      {Icon ? (
                        <Icon size={15} className="text-accent-soft" aria-hidden />
                      ) : (
                        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent-cyan/70" />
                      )}
                      {name}
                    </li>
                  ))}
                </ul>
              </Spotlight>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
