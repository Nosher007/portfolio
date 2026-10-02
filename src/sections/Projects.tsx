import { FiArrowUpRight, FiCheck, FiGithub } from 'react-icons/fi'
import Reveal from '../components/ui/Reveal'
import SectionHeading from '../components/ui/SectionHeading'
import Spotlight from '../components/ui/Spotlight'
import { projects } from '../data/projects'
import type { Project } from '../types'

/** Project artwork in a browser-window frame. The source SVGs are light, so they are inverted for the dark theme. */
function Preview({ project, caption }: { project: Project; caption: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-ink-950">
      <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-3.5 py-2.5">
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="ml-3 truncate font-mono text-[10px] text-zinc-500">{caption}</span>
      </div>
      <div className="aspect-video overflow-hidden">
        {project.image && (
          <img
            src={project.image}
            alt={`${project.title} diagram`}
            loading="lazy"
            className="h-full w-full object-cover opacity-90 invert hue-rotate-180 transition-transform duration-700 group-hover/spot:scale-[1.03]"
          />
        )}
      </div>
    </div>
  )
}

function Links({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {project.liveUrl && (
        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary !px-5 !py-2.5">
          Live app <FiArrowUpRight />
        </a>
      )}
      {project.githubUrl && (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${project.title} on GitHub`}
          className="btn-ghost !px-5 !py-2.5"
        >
          <FiGithub /> Code
        </a>
      )}
    </div>
  )
}

function Tags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((t) => (
        <span key={t} className="chip">
          {t}
        </span>
      ))}
    </div>
  )
}

export default function Projects() {
  const [featured, ...rest] = projects

  return (
    <section id="projects" className="relative overflow-hidden py-24 lg:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-40 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-accent/[0.07] blur-[140px]" />

      <div className="relative mx-auto max-w-content px-5 sm:px-6">
        <SectionHeading index="03" label="Projects">
          Things I&apos;ve <span className="text-gradient">built.</span>
        </SectionHeading>

        {/* Featured project */}
        <Reveal>
          <Spotlight className="card grid gap-8 p-5 transition-all duration-500 hover:border-accent/30 hover:shadow-glow sm:p-7 lg:grid-cols-[1.15fr_1fr] lg:gap-10 lg:p-8">
            <div className="self-center">
              <Preview project={featured} caption={featured.liveUrl?.replace('https://', '') ?? featured.title} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-zinc-500">{featured.number}</span>
                <span className="rounded-full bg-gradient-to-r from-accent to-accent-cyan px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-ink-950">
                  Featured
                </span>
              </div>
              <h3 className="mt-3 font-sora text-h3 font-bold text-white">{featured.title}</h3>
              <p className="mt-1 font-mono text-xs text-accent-soft">{featured.kind}</p>
              <p className="mt-4 text-[15px] leading-relaxed text-zinc-400">{featured.description}</p>
              {featured.highlights && (
                <ul className="mt-5 space-y-2.5">
                  {featured.highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-sm leading-relaxed text-zinc-300">
                      <FiCheck className="mt-0.5 flex-shrink-0 text-accent-cyan" />
                      {h}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-6">
                <Tags tags={featured.tags} />
              </div>
              <div className="mt-7 lg:mt-auto lg:pt-7">
                <Links project={featured} />
              </div>
            </div>
          </Spotlight>
        </Reveal>

        {/* The rest */}
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((project, i) => (
            <Reveal key={project.number} delay={i * 0.08} className="h-full">
              <Spotlight className="card flex h-full flex-col p-5 transition-all duration-500 hover:-translate-y-1 hover:border-accent/30 hover:shadow-glow">
                <Preview project={project} caption={project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')} />
                <div className="mt-5 flex items-center justify-between">
                  <span className="font-mono text-xs text-zinc-500">{project.number}</span>
                  <span className="font-mono text-[11px] text-accent-soft">{project.kind}</span>
                </div>
                <h3 className="mt-2 font-sora text-h4 font-semibold text-white">{project.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400">{project.description}</p>
                <div className="mt-5">
                  <Tags tags={project.tags} />
                </div>
                {(project.githubUrl || project.liveUrl) && (
                  <div className="mt-6">
                    <Links project={project} />
                  </div>
                )}
              </Spotlight>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
