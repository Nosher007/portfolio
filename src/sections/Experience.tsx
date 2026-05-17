import { experiences } from '../data/experience'

export default function Experience() {
  return (
    <section id="experience" className="py-20 lg:py-24 bg-black text-white">
      <div className="max-w-content mx-auto px-6 lg:px-20">
        <h2 className="font-sora font-bold text-h1 text-white text-center mb-16">
          My Experience
        </h2>

        <div className="flex flex-col gap-6">
          {experiences.map((exp) => (
            <div
              key={`${exp.company}-${exp.title}`}
              className="border border-zinc-800 p-8 hover:border-zinc-500 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-5">
                <div>
                  <h3 className="font-sora font-bold text-h5 text-white">
                    {exp.title}{' '}
                    <span className="text-zinc-300">at {exp.company}</span>
                  </h3>
                  <p className="font-sora text-p3 text-zinc-500 mt-1">
                    {exp.location}
                  </p>
                </div>
                <span className="font-sora text-p3 text-zinc-500 whitespace-nowrap">
                  {exp.startDate} – {exp.endDate}
                </span>
              </div>

              <ul className="flex flex-col gap-2">
                {exp.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="font-sora text-p2 text-zinc-300 flex gap-3"
                  >
                    <span className="text-zinc-600 mt-1 flex-shrink-0">–</span>
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
