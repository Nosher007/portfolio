import heroIllustration from '../assets/images/hero-illustration.svg'

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-16 pb-8">
      <div className="max-w-content mx-auto px-6 lg:px-20 w-full py-20 lg:py-0">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-8">

          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <p className="font-sora text-p2 text-zinc-500 mb-4">
              MS Data Science · Drexel University · Philadelphia, PA
            </p>
            <h1 className="font-sora font-extrabold text-display leading-[1.1] text-black">
              Hello I'm
            </h1>
            <h1 className="font-sora font-extrabold text-display leading-[1.1] text-black">
              Nosherwan Babar.
            </h1>
            <h1 className="font-sora font-extrabold text-display leading-[1.1] text-black mb-6">
              <span className="relative inline-block">
                ML Engineer &
                <span className="absolute -bottom-1 left-0 right-0 h-[5px] bg-black rounded-full" />
              </span>
              <br />
              Data Scientist
            </h1>
            <p className="font-sora text-p1 text-zinc-500 max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed">
              Specializing in MLOps, LLM-powered systems, and scalable data pipelines.
              Open to full-time roles starting July 2026.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-4 justify-center lg:justify-start">
              <a
                href="https://github.com/Nosher007"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-10 h-10 border border-zinc-200 flex items-center justify-center hover:border-black hover:bg-black hover:text-white transition-all text-black"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/nosherwan-babar/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 border border-zinc-200 flex items-center justify-center hover:border-black hover:bg-black hover:text-white transition-all text-black"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="mailto:nosherwanbabar@gmail.com"
                aria-label="Email"
                className="w-10 h-10 border border-zinc-200 flex items-center justify-center hover:border-black hover:bg-black hover:text-white transition-all text-black"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </a>
            </div>
          </div>

          {/* Illustration */}
          <div className="flex-shrink-0 w-72 lg:w-[420px]">
            <img
              src={heroIllustration}
              alt="Developer illustration"
              className="w-full h-auto"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
