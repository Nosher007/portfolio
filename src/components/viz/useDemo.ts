import { useEffect, useRef } from 'react'

export interface Demo {
  frame(now: number): void
  /** Draw a complete, motionless state (first paint and reduced motion) */
  still(): void
  destroy?(): void
}

/**
 * Builds an imperative demo on mount and animates it only while it is on
 * screen and the visitor allows motion. `create` must be a stable function.
 */
export function useDemo<T extends Element, D extends Demo>(create: (root: T) => D) {
  const ref = useRef<T>(null)
  const demoRef = useRef<D | null>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const demo = create(root)
    demoRef.current = demo
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false
    let raf = 0
    const tick = (now: number) => {
      demo.frame(now)
      raf = requestAnimationFrame(tick)
    }
    const sync = () => {
      cancelAnimationFrame(raf)
      raf = 0
      if (visible && !motionQuery.matches) raf = requestAnimationFrame(tick)
      else demo.still()
    }
    demo.still()
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        sync()
      },
      { rootMargin: '80px' },
    )
    io.observe(root)
    motionQuery.addEventListener('change', sync)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      motionQuery.removeEventListener('change', sync)
      demo.destroy?.()
      demoRef.current = null
    }
  }, [create])

  return { ref, demoRef }
}
