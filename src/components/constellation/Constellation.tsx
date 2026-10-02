import { useCallback, useEffect, useRef, useState } from 'react'
import ConstellationCanvas from './ConstellationCanvas'
import { HUB_COUNT, type Controller, type Mode } from './controller'
import { useActiveSection } from '../../hooks/useActiveSection'
import { RESUME_URL, SECTIONS, prefersReducedMotion, scrollToSection, track } from '../../lib/sections'

const HUBS = [...SECTIONS, { id: 'resume', label: 'Resume', hint: 'Open PDF ↗' }] as const
const SECTION_IDS = SECTIONS.map((s) => s.id)

if (HUBS.length !== HUB_COUNT) throw new Error('Hub count mismatch')

function isCompact() {
  return window.innerWidth < 768
}

export default function Constellation() {
  const active = useActiveSection(SECTION_IDS)
  const [mode, setMode] = useState<Mode>('hero')
  const [expanded, setExpanded] = useState(false)
  const [compact] = useState(isCompact)
  const closeTimer = useRef(0)
  const dockRef = useRef<HTMLDivElement>(null)
  const pressedAt = useRef(-Infinity)

  const ctl = useRef<Controller>({
    mode: 'hero',
    dockExpanded: false,
    hoverHub: -1,
    focusHub: -1,
    activeHub: -1,
    dive: null,
    pointer: { x: 0, y: 0 },
    reduced: prefersReducedMotion(),
    compact,
    suppressDock: false,
    labelEls: [],
    hubScreen: [],
    flashEl: null,
    onModeChange: () => {},
    onDiveArrive: () => {},
  })

  const setDock = useCallback((open: boolean) => {
    window.clearTimeout(closeTimer.current)
    ctl.current.dockExpanded = open
    setExpanded(open)
  }, [])

  const holdOpen = useCallback(() => window.clearTimeout(closeTimer.current), [])
  const scheduleClose = useCallback(() => {
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setDock(false), 260)
  }, [setDock])

  /** Visible hub whose node or label is closest to a screen point (within reach), or -1 */
  const nearestHub = useCallback((x: number, y: number) => {
    let best = -1
    let bestD = 56
    ctl.current.hubScreen.forEach((h, i) => {
      if (!h || h.op < 0.5) return
      const r = ctl.current.labelEls[i]?.getBoundingClientRect()
      const toLabel = r
        ? Math.hypot(Math.max(r.left - x, 0, x - r.right), Math.max(r.top - y, 0, y - r.bottom))
        : Infinity
      const d = Math.min(Math.hypot(h.x - x, h.y - y), toLabel)
      if (d < bestD) {
        bestD = d
        best = i
      }
    })
    return best
  }, [])

  const navigate = useCallback(
    (i: number) => {
      const hub = HUBS[i]
      const c = ctl.current
      track('constellation_nav', { target: hub.id, from: c.mode })
      if (hub.id === 'resume') {
        window.open(RESUME_URL, '_blank', 'noopener')
        return
      }
      if (c.mode === 'hero' && !c.reduced) {
        if (!c.dive) c.dive = { hub: i, start: performance.now() }
        return
      }
      scrollToSection(hub.id)
      setDock(false)
    },
    [setDock],
  )

  // Wire scene callbacks and keep the shared controller in sync with React state
  useEffect(() => {
    const c = ctl.current
    c.onModeChange = (m) => {
      setMode(m)
      if (m !== 'dock') setDock(false)
    }
    c.onDiveArrive = (i) => {
      const section = document.getElementById(HUBS[i].id)
      c.hoverHub = -1
      c.focusHub = -1
      if (!section) return
      section.scrollIntoView({ behavior: 'instant', block: 'start' })
      history.replaceState(null, '', `#${HUBS[i].id}`)
      // Hand keyboard focus to the section we just "arrived" in
      section.setAttribute('tabindex', '-1')
      section.focus({ preventScroll: true })
    }
  }, [setDock])

  useEffect(() => {
    ctl.current.activeHub = active ? HUBS.findIndex((h) => h.id === active) : -1
  }, [active])

  useEffect(() => {
    const c = ctl.current
    const onPointer = (e: PointerEvent) => {
      c.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      c.pointer.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    const onResize = () => {
      c.compact = isCompact()
    }
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onMotion = () => {
      c.reduced = motionQuery.matches
    }
    const isField = (t: EventTarget | null) => t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement
    const onFocusIn = (e: FocusEvent) => {
      c.suppressDock = c.compact && isField(e.target)
    }
    const onFocusOut = () => {
      c.suppressDock = false
    }
    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('resize', onResize)
    motionQuery.addEventListener('change', onMotion)
    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('focusout', onFocusOut)
    return () => {
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('resize', onResize)
      motionQuery.removeEventListener('change', onMotion)
      document.removeEventListener('focusin', onFocusIn)
      document.removeEventListener('focusout', onFocusOut)
    }
  }, [])

  // Tap outside / Escape closes the expanded mini-map
  useEffect(() => {
    if (!expanded) return
    const onDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement
      if (dockRef.current?.contains(target) || target.closest('[data-hub-label]')) return
      setDock(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDock(false)
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [expanded, setDock])

  const inDock = mode === 'dock'
  const dockSize = expanded ? (compact ? 200 : 236) : compact ? 76 : 100
  const margin = compact ? 14 : 22
  const activeLabel = SECTIONS.find((s) => s.id === active)?.label

  return (
    <>
      <ConstellationCanvas ctl={ctl} compact={compact} />

      {/* Mini-map hit area: hover (desktop) or tap (touch) to expand */}
      <div
        ref={dockRef}
        className={`fixed z-40 transition-all duration-300 ${expanded ? 'rounded-3xl' : 'rounded-full'} ${inDock ? '' : 'pointer-events-none'}`}
        // When open, the hit area also spans the labels to the left of the sphere
        style={{
          width: expanded ? Math.min(dockSize + 170, window.innerWidth - 2 * margin) : dockSize,
          height: expanded ? dockSize + 30 : dockSize,
          right: margin,
          bottom: margin,
        }}
        onMouseEnter={() => {
          if (!inDock) return
          holdOpen()
          setDock(true)
        }}
        onMouseLeave={scheduleClose}
      >
        <button
          type="button"
          tabIndex={inDock ? 0 : -1}
          aria-label={expanded ? 'Close section map' : 'Open section map'}
          aria-expanded={expanded}
          onPointerDown={(e) => {
            if (e.pointerType !== 'mouse' || e.button !== 0 || !expanded) return
            // Mouse on the open map: go to the node nearest the cursor, and never
            // close the map from a near-miss (it closes when the mouse leaves)
            e.preventDefault()
            pressedAt.current = performance.now()
            const hub = nearestHub(e.clientX, e.clientY)
            if (hub >= 0) navigate(hub)
          }}
          onClick={(e) => {
            if (performance.now() - pressedAt.current < 800) return
            // Keyboard toggles; a tap on the open map picks the nearest node
            const hub = expanded && e.detail > 0 ? nearestHub(e.clientX, e.clientY) : -1
            if (hub >= 0) navigate(hub)
            else setDock(!expanded)
          }}
          className="h-full w-full rounded-[inherit]"
        />
      </div>

      {/* "You are here" caption next to the collapsed mini-map */}
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setDock(true)}
        className={`fixed z-40 flex items-center gap-2 rounded-full border border-white/10 bg-ink-950/80 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-300 backdrop-blur-md transition-all duration-500 ${
          inDock && !expanded && activeLabel ? 'opacity-100' : 'pointer-events-none translate-x-2 opacity-0'
        }`}
        style={{ right: margin + dockSize + 10, bottom: margin + dockSize / 2 - 12 }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan shadow-[0_0_8px_#5ee6ff]" />
        {activeLabel ?? ''}
      </button>

      {/* Hub labels, positioned every frame by the scene */}
      <nav aria-label="Network navigation" className="pointer-events-none fixed inset-0 z-[45]">
        {HUBS.map((hub, i) => (
          <button
            key={hub.id}
            type="button"
            data-hub-label
            data-lit="false"
            ref={(el) => {
              ctl.current.labelEls[i] = el
            }}
            aria-label={hub.id === 'resume' ? 'Open resume (PDF)' : `Go to ${hub.label}`}
            style={{ visibility: 'hidden', opacity: 0 }}
            // Mouse: act on press, so the label moving before release (the
            // mini-map grows as it opens) can't swallow the click.
            // Keyboard (detail 0) and touch still go through onClick.
            onPointerDown={(e) => {
              if (e.pointerType !== 'mouse' || e.button !== 0) return
              e.preventDefault()
              pressedAt.current = performance.now()
              navigate(i)
            }}
            onClick={() => {
              // Skip the click that follows a mouse press we already acted on
              if (performance.now() - pressedAt.current > 800) navigate(i)
            }}
            onMouseEnter={() => {
              ctl.current.hoverHub = i
              holdOpen()
            }}
            onMouseLeave={() => {
              ctl.current.hoverHub = -1
              if (inDock) scheduleClose()
            }}
            onFocus={(e) => {
              // Only keyboard focus turns the sphere. A mouse press also focuses the
              // button, and rotating then would slide it out from under the cursor
              // before mouseup, swallowing the click.
              if (e.currentTarget.matches(':focus-visible')) ctl.current.focusHub = i
            }}
            onBlur={() => {
              ctl.current.focusHub = -1
            }}
            className={`group absolute left-0 top-0 flex items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-ink-950/90 font-mono text-zinc-200 backdrop-blur-md transition-[border-color,box-shadow,color] duration-300 will-change-transform hover:border-accent/70 hover:text-white data-[lit=true]:border-accent/60 data-[lit=true]:text-white data-[lit=true]:z-10 data-[lit=true]:shadow-glow before:absolute before:top-1/2 before:h-9 before:w-9 before:-translate-y-1/2 before:rounded-full before:content-[''] data-[side=left]:before:-right-[30px] data-[side=right]:before:-left-[30px] ${
              inDock ? 'px-2.5 py-1 text-[10px]' : 'px-3 py-1.5 text-[11px]'
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan shadow-[0_0_8px_#5ee6ff]" />
            {hub.label}
            {!inDock && (
              <span className="max-w-0 overflow-hidden text-zinc-400 transition-[max-width] duration-500 group-hover:max-w-[160px] group-focus-visible:max-w-[160px] group-data-[lit=true]:max-w-[160px]">
                · {hub.hint}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Flash that covers the jump when diving into a node */}
      <div
        aria-hidden
        ref={(el) => {
          ctl.current.flashEl = el
        }}
        className="pointer-events-none fixed inset-0 z-[60] opacity-0"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(214,250,255,0.95) 0%, rgba(94,230,255,0.75) 12%, rgba(139,124,255,0.65) 32%, #07070b 78%)',
        }}
      />
    </>
  )
}
