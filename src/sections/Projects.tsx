import { projects } from '../data/projects'

export default function Projects() {
  return (
    <section id="projects" className="py-20 lg:py-24 bg-black">
      <div className="max-w-content mx-auto px-6 lg:px-20">
        <h2 className="font-sora font-bold text-h1 text-white text-center mb-16">
          My Projects
        </h2>

        <div className="flex flex-col gap-20">
          {projects.map((project, index) => {
            const isEven = index % 2 === 1

            return (
              <div
                key={project.number}
                className={`flex flex-col ${isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12`}
              >
                {/* Project preview */}
                <div className="w-full lg:w-1/2 aspect-video flex-shrink-0 overflow-hidden border border-zinc-800">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={`${project.title} preview`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                      <span className="font-sora text-p3 text-zinc-500">{project.title}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <span className="font-sora font-bold text-display text-zinc-800 leading-none block mb-2">
                    {project.number}
                  </span>
                  <h3 className="font-sora font-bold text-h2 text-white mb-4">
                    {project.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-sora text-p3 font-medium border border-zinc-700 px-3 py-1 text-zinc-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="font-sora text-p2 text-zinc-400 leading-relaxed mb-6">
                    {project.description}
                  </p>
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${project.title} on GitHub`}
                      className="inline-flex items-center gap-2 font-sora text-p2 font-semibold text-white border-b border-white pb-0.5 hover:text-zinc-400 hover:border-zinc-400 transition-colors"
                    >
                      View on GitHub ↗
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
