import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useActiveSection } from '../hooks/useActiveSection'
import { RESUME_URL, SECTIONS } from '../lib/sections'

const SECTION_IDS = SECTIONS.map((s) => s.id)

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const active = useActiveSection(SECTION_IDS)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <nav
        className={`mx-auto flex h-14 max-w-content items-center justify-between rounded-full border px-4 transition-all duration-500 sm:px-5 ${
          scrolled || menuOpen
            ? 'border-white/10 bg-ink-950/70 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.9)] backdrop-blur-xl'
            : 'border-transparent bg-transparent'
        }`}
      >
        <a href="#" className="group flex items-center gap-2 font-sora text-lg font-bold tracking-tight text-white">
          <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-cyan text-[11px] font-extrabold text-ink-950">
            NB
          </span>
          <span className="hidden sm:inline">Nosherwan</span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {SECTIONS.map((link) => {
            const isActive = active === link.id
            return (
              <li key={link.id} className="relative">
                <a
                  href={`#${link.id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={`relative z-10 block rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {link.label}
                </a>
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.06]"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
              </li>
            )
          })}
        </ul>

        <a
          href={RESUME_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-2 rounded-full border border-white/15 px-4 py-2 font-sora text-xs font-semibold text-white transition-all hover:border-accent/60 hover:shadow-glow md:inline-flex"
        >
          Resume ↗
        </a>

        {/* Hamburger */}
        <button
          className="flex flex-col gap-1.5 p-2 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className={`block h-0.5 w-6 bg-white transition-transform ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block h-0.5 w-6 bg-white transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-6 bg-white transition-transform ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="mx-auto mt-2 max-w-content rounded-3xl border border-white/10 bg-ink-950/90 p-6 backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {SECTIONS.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className={`block rounded-xl px-3 py-2.5 font-sora text-base ${
                      active === link.id ? 'bg-white/[0.06] text-white' : 'text-zinc-300'
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <a href={RESUME_URL} target="_blank" rel="noopener noreferrer" className="btn-primary mt-4">
              Resume ↗
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
