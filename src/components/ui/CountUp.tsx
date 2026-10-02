import { useEffect, useRef } from 'react'
import { animate, useInView } from 'motion/react'
import { prefersReducedMotion } from '../../lib/sections'

interface CountUpProps {
  to: number
  decimals?: number
  suffix?: string
}

export default function CountUp({ to, decimals = 0, suffix = '' }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    const el = ref.current
    if (!inView || !el) return
    const format = (v: number) => `${v.toFixed(decimals)}${suffix}`
    if (prefersReducedMotion()) {
      el.textContent = format(to)
      return
    }
    const controls = animate(0, to, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        el.textContent = format(v)
      },
    })
    return () => controls.stop()
  }, [inView, to, decimals, suffix])

  return (
    <span ref={ref} aria-label={`${to}${suffix}`}>
      {(0).toFixed(decimals)}
      {suffix}
    </span>
  )
}
