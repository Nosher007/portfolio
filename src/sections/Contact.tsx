import { useState, type FormEvent } from 'react'

type Status = 'idle' | 'sending' | 'success' | 'error'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', website: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('sending')

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_KEY,
          name: form.name,
          email: form.email,
          website: form.website || undefined,
          message: form.message,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setStatus('success')
        setForm({ name: '', email: '', website: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const inputClass =
    'w-full border border-zinc-200 px-4 py-3 font-sora text-p2 text-black placeholder:text-zinc-500 focus:outline-none focus:border-black transition-colors'

  return (
    <section id="contact" className="py-20 lg:py-24 bg-white">
      <div className="max-w-content mx-auto px-6 lg:px-20">
        <div className="flex flex-col lg:flex-row gap-16 items-start">

          {/* Form */}
          <div className="flex-1 w-full order-2 lg:order-1">
            {status === 'success' ? (
              <div className="border border-zinc-200 px-8 py-12 flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 border-2 border-black flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="font-sora font-bold text-h4 text-black">Message sent!</h3>
                <p className="font-sora text-p2 text-zinc-500">Thanks for reaching out — I'll get back to you soon.</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-2 font-sora text-p3 font-semibold text-black border-b border-black pb-0.5 hover:text-zinc-500 hover:border-zinc-500 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="name" className="sr-only">Name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Your Name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="sr-only">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="website" className="sr-only">Website (optional)</label>
                  <input
                    id="website"
                    type="url"
                    placeholder="Your Website (optional)"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="message" className="sr-only">Message</label>
                  <textarea
                    id="message"
                    placeholder="Your Message *"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {status === 'error' && (
                  <p className="font-sora text-p3 text-error">
                    Something went wrong. Please try again or email me directly.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="self-start bg-black text-white font-sora font-semibold text-p2 px-8 py-3 hover:bg-neutral transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'sending' ? 'Sending…' : 'Get In Touch'}
                </button>
              </form>
            )}
          </div>

          {/* Contact details */}
          <div className="lg:w-80 flex-shrink-0 order-1 lg:order-2">
            <h2 className="font-sora font-bold text-h2 text-black mb-2 leading-tight">
              Let's{' '}
              <span className="relative inline-block">
                talk
                <span className="absolute bottom-0.5 left-0 right-0 h-0.5 bg-black" />
              </span>{' '}
              for
            </h2>
            <h2 className="font-sora font-bold text-h2 text-black mb-6 leading-tight">
              Something special
            </h2>
            <p className="font-sora text-p2 text-zinc-500 leading-relaxed mb-8">
              Open to full-time ML Engineer and Data Scientist roles starting July 2026.
              Always happy to discuss projects, research, or collaborations.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:nosherwanbabar@gmail.com"
                className="font-sora text-p2 text-black hover:text-zinc-500 transition-colors"
              >
                nosherwanbabar@gmail.com
              </a>
              <a
                href="tel:+12675919208"
                className="font-sora text-p2 text-black hover:text-zinc-500 transition-colors"
              >
                267-591-9208
              </a>
            </div>
            <a
              href="https://calendly.com/nosherwanbabar/15min"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 bg-black text-white font-sora font-semibold text-p2 px-6 py-3 hover:bg-zinc-800 transition-colors"
            >
              Book a Meeting ↗
            </a>
          </div>

        </div>
      </div>
    </section>
  )
}
