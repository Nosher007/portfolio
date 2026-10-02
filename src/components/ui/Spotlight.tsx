import type { HTMLAttributes, MouseEvent } from 'react'

/** Card with a soft violet light that follows the cursor */
export default function Spotlight({ className = '', children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`)
  }

  return (
    <div onMouseMove={onMove} className={`group/spot relative overflow-hidden ${className}`} {...rest}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{
          background:
            'radial-gradient(420px circle at var(--x, 50%) var(--y, 50%), rgba(139,124,255,0.13), transparent 45%)',
        }}
      />
      {children}
    </div>
  )
}
