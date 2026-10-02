import type { ReactNode } from 'react'
import Reveal from './Reveal'

interface SectionHeadingProps {
  index: string
  label: string
  children: ReactNode
  align?: 'left' | 'center'
}

export default function SectionHeading({ index, label, children, align = 'left' }: SectionHeadingProps) {
  const centered = align === 'center'
  return (
    <Reveal className={`mb-14 ${centered ? 'text-center' : ''}`}>
      <p className={`eyebrow mb-4 flex items-center gap-3 ${centered ? 'justify-center' : ''}`}>
        <span className="text-zinc-500">{index}</span>
        <span className="h-px w-8 bg-gradient-to-r from-accent to-accent-cyan" />
        {label}
      </p>
      <h2 className="font-sora text-h1 font-bold text-white">{children}</h2>
    </Reveal>
  )
}
