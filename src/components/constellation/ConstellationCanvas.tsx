import { useEffect, useRef, type RefObject } from 'react'
import { PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import { CAMERA_DIST, ConstellationEngine } from './engine'
import type { Controller } from './controller'

/** Full-viewport, click-through WebGL layer that runs the constellation engine */
export default function ConstellationCanvas({ ctl, compact }: { ctl: RefObject<Controller>; compact: boolean }) {
  const host = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = host.current
    if (!el) return

    const renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
    renderer.setClearColor(0x000000, 0)
    el.appendChild(renderer.domElement)

    const scene = new Scene()
    const camera = new PerspectiveCamera(35, 1, 0.1, 100)
    camera.position.set(0, 0, CAMERA_DIST)
    const engine = new ConstellationEngine(compact)
    scene.add(engine.group)

    // Size to the host (excludes the scrollbar), not window.innerWidth,
    // so the canvas lines up with the fixed-position mini-map disc
    const resize = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    window.addEventListener('resize', resize)

    const start = performance.now()
    let last = start
    let drewLast = true
    let frame = requestAnimationFrame(function tick(now) {
      frame = requestAnimationFrame(tick)
      const visible = engine.update(ctl.current, {
        t: (now - start) / 1000,
        dt: (now - last) / 1000,
        width: el.clientWidth,
        height: el.clientHeight,
        dpr: renderer.getPixelRatio(),
        camera,
      })
      last = now
      if (visible || drewLast) renderer.render(scene, camera)
      drewLast = visible
    })

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      engine.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [ctl, compact])

  return <div ref={host} aria-hidden className="pointer-events-none fixed inset-0 z-30" />
}
