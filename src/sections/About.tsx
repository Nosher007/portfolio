import aboutIllustration from '../assets/images/about-illustration.svg'

export default function About() {
  return (
    <section id="about" className="py-20 lg:py-24 bg-white">
      <div className="max-w-content mx-auto px-6 lg:px-20">
        <div className="flex flex-col lg:flex-row items-center gap-16">

          {/* Illustration */}
          <div className="flex-shrink-0 w-56 lg:w-72">
            <img
              src={aboutIllustration}
              alt="About me illustration"
              className="w-full h-auto"
              loading="lazy"
            />
          </div>

          {/* Text */}
          <div className="flex-1">
            <h2 className="font-sora font-bold text-h1 text-black mb-8">
              About{' '}
              <span className="relative inline-block">
                Me
                <span className="absolute -bottom-1 left-0 right-0 h-[5px] bg-black rounded-full" />
              </span>
            </h2>

            <div className="flex flex-col gap-4">
              <p className="font-sora text-p2 text-neutral leading-relaxed">
                I'm an ML Engineer and Data Scientist currently pursuing my MS in Data
                Science at Drexel University (GPA 3.75, graduating July 2026).
              </p>
              <p className="font-sora text-p2 text-neutral leading-relaxed">
                I specialize in building production ML systems — from data pipelines and
                model training to deployment and monitoring. My recent work at URBN
                involved GCP-native MLOps: BigQuery, DBT, Airflow, and REST APIs.
              </p>
              <p className="font-sora text-p2 text-neutral leading-relaxed">
                I'm particularly drawn to LLM-powered systems. CyberSentinel, my flagship
                project, is a 5-agent LangGraph platform with RAG over CVE data, deployed
                on Cloud Run with 332 tests.
              </p>
              <p className="font-sora text-p2 text-neutral leading-relaxed">
                When I'm not building, I'm finishing my thesis and looking for full-time
                ML/Data roles starting July 2026.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
