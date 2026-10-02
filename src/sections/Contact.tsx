import { useState, type FormEvent } from 'react'
import { FiArrowUpRight, FiCalendar, FiMail, FiMapPin, FiPhone } from 'react-icons/fi'
import Reveal from '../components/ui/Reveal'
import SectionHeading from '../components/ui/SectionHeading'
import { CALENDLY, EMAIL, PHONE } from '../lib/links'

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
    'w-full rounded-xl border border-white/10 bg-ink-950/60 px-4 py-3 text-[15px] text-white placeholder:text-zinc-600 transition-colors focus:border-accent/70 focus:outline-none focus:ring-4 focus:ring-accent/10'
  const labelClass = 'mb-2 block font-mono text-[11px] uppercase tracking-wider text-zinc-500'

  const details = [
    { Icon: FiMail, label: EMAIL, href: `mailto:${EMAIL}` },
    { Icon: FiPhone, label: PHONE.display, href: PHONE.href },
    { Icon: FiMapPin, label: 'Bethesda, MD' },
  ]

  return (
    <section id="contact" className="relative py-24 lg:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="mx-auto max-w-content px-5 sm:px-6">
        <SectionHeading index="05" label="Contact">
          Let&apos;s build something <span className="text-gradient">intelligent.</span>
        </SectionHeading>

        <Reveal>
          <div className="relative rounded-3xl bg-gradient-to-br from-accent/40 via-white/[0.06] to-accent-cyan/30 p-px">
            <div className="grid gap-10 rounded-[23px] bg-ink-900 p-6 sm:p-10 lg:grid-cols-[1fr_1.25fr] lg:gap-14">
              {/* Details */}
              <div>
                <p className="text-[17px] leading-relaxed text-zinc-400">
                  Open to full-time ML engineer, AI engineer, and data scientist roles. Always happy to talk about
                  projects, research, or collaborations.
                </p>
                <ul className="mt-8 space-y-4">
                  {details.map(({ Icon, label, href }) => (
                    <li key={label} className="flex items-center gap-3.5">
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-accent-soft">
                        <Icon size={16} />
                      </span>
                      {href ? (
                        <a href={href} className="text-sm text-zinc-200 transition-colors hover:text-white">
                          {label}
                        </a>
                      ) : (
                        <span className="text-sm text-zinc-400">{label}</span>
                      )}
                    </li>
                  ))}
                </ul>
                <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="btn-ghost mt-9">
                  <FiCalendar /> Book a 15-min call <FiArrowUpRight />
                </a>
              </div>

              {/* Form */}
              <div>
                {status === 'success' ? (
                  <div className="flex h-full flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 px-8 py-14 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-cyan text-ink-950">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <h3 className="font-sora text-h4 font-bold text-white">Message sent!</h3>
                    <p className="text-sm text-zinc-400">Thanks for reaching out — I&apos;ll get back to you soon.</p>
                    <button
                      onClick={() => setStatus('idle')}
                      className="mt-2 border-b border-accent-soft pb-0.5 font-mono text-xs text-accent-soft transition-colors hover:text-white"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className={labelClass}>Name</label>
                      <input
                        id="name"
                        type="text"
                        placeholder="Ada Lovelace"
                        required
                        autoComplete="name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className={labelClass}>Email</label>
                      <input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        required
                        autoComplete="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="website" className={labelClass}>Website (optional)</label>
                      <input
                        id="website"
                        type="url"
                        placeholder="https://"
                        value={form.website}
                        onChange={(e) => setForm({ ...form, website: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="message" className={labelClass}>Message</label>
                      <textarea
                        id="message"
                        placeholder="Tell me about the role or project…"
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className={`${inputClass} resize-none`}
                      />
                    </div>

                    {status === 'error' && (
                      <p className="text-sm text-error sm:col-span-2">
                        Something went wrong. Please try again or email me directly.
                      </p>
                    )}

                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        disabled={status === 'sending'}
                        className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {status === 'sending' ? 'Sending…' : 'Send message'}
                        <span aria-hidden>→</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
