export const SECTIONS = [
  { id: 'about', label: 'About', hint: 'Who I am' },
  { id: 'experience', label: 'Experience', hint: 'URBN · Buggcy' },
  { id: 'projects', label: 'Projects', hint: '4 AI systems' },
  { id: 'skills', label: 'Skills', hint: 'LLMs · MLOps · GCP' },
  { id: 'contact', label: 'Contact', hint: "Let's talk" },
] as const

export type SectionId = (typeof SECTIONS)[number]['id']

export const RESUME_URL = '/Resume.pdf'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function track(event: string, params: Record<string, string>) {
  window.gtag?.('event', event, params)
}

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function scrollToSection(id: string, behavior: ScrollBehavior = 'smooth') {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : behavior, block: 'start' })
  history.replaceState(null, '', `#${id}`)
}
