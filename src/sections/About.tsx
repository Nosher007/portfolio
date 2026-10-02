import Reveal from '../components/ui/Reveal'
import SectionHeading from '../components/ui/SectionHeading'
import Spotlight from '../components/ui/Spotlight'

const facts = [
  { label: 'Based in', value: 'Bethesda, MD' },
  {
    label: 'Education',
    value: 'MS Data Science, Drexel University',
    sub: 'GPA 3.75 · September 2026',
  },
  { label: '', value: 'BS Computer Science, University of Central Punjab', sub: '2023' },
  { label: 'Focus', value: 'LLM systems · RAG · Evaluation · MLOps' },
]

const competencies = [
  'Production Software Engineering',
  'Customer Co-Engineering',
  'Responsible AI & Safeguards',
  'LLM Solutions',
  'Evaluation & Observability',
  'Automated Testing',
]

export default function About() {
  return (
    <section id="about" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-content px-5 sm:px-6">
        <SectionHeading index="01" label="About">
          Engineer first, <span className="text-gradient">AI by obsession.</span>
        </SectionHeading>

        <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
          <Reveal className="space-y-5 text-[17px] leading-relaxed text-zinc-400">
            <p>
              I&apos;m a software engineer who builds <span className="text-zinc-100">production AI services</span>{' '}
              and delivers them directly with the people who use them.
            </p>
            <p>
              At Buggcy I shipped 25+ Python and JavaScript services across 4 client engagements, embedded with each
              customer team from requirements through production. At URBN I deployed and monitored ML across{' '}
              <span className="text-zinc-100">7 production systems on GCP</span>, from fine-tuning transformers on
              Vertex AI to drift-triggered retraining in Airflow.
            </p>
            <p>
              I also build and run <span className="text-zinc-100">CyberSentinel</span>, a multi-agent LLM platform
              with RAG, a 332-test evaluation suite, and responsible-AI safeguards as release gates. I&apos;m finishing
              my MS in Data Science at Drexel, with a thesis on parameter-efficient fine-tuning.
            </p>

            <div className="flex flex-wrap gap-2 pt-3">
              {competencies.map((c) => (
                <span key={c} className="chip">
                  {c}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <Spotlight className="card p-7">
              <div className="mb-6 flex items-center justify-between">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">profile.json</p>
                <span className="flex items-center gap-2 font-mono text-[11px] text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> available
                </span>
              </div>
              <dl className="divide-y divide-white/[0.06]">
                {facts.map((f) => (
                  <div key={f.value} className="grid grid-cols-[92px_1fr] gap-4 py-3.5">
                    <dt className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">{f.label}</dt>
                    <dd>
                      <p className="text-sm text-zinc-100">{f.value}</p>
                      {f.sub && <p className="mt-0.5 font-mono text-[11px] text-zinc-500">{f.sub}</p>}
                    </dd>
                  </div>
                ))}
              </dl>
            </Spotlight>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
