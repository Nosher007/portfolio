import { SOCIALS } from '../lib/links'

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-10">
      <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-5 px-5 sm:px-6 md:flex-row">
        <p className="font-mono text-xs text-zinc-500">© 2025–2026 Nosherwan Babar · Designed &amp; built in React + Three.js</p>
        <div className="flex items-center gap-2">
          {SOCIALS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-white/[0.05] hover:text-white"
            >
              <Icon size={16} />
            </a>
          ))}
          <a href="#" className="ml-2 font-mono text-xs text-zinc-500 transition-colors hover:text-white">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  )
}
