/**
 * Mutable state shared between the DOM overlay (labels, dock) and the
 * WebGL scene. The scene reads it every frame, so it lives in a ref rather
 * than React state to avoid re-rendering at 60fps.
 */
export type Mode = 'hero' | 'dock' | 'hidden'

export interface Controller {
  mode: Mode
  dockExpanded: boolean
  hoverHub: number
  focusHub: number
  activeHub: number
  dive: { hub: number; start: number } | null
  pointer: { x: number; y: number }
  reduced: boolean
  compact: boolean
  /** Hide the mini-map, e.g. while typing in the contact form on a phone */
  suppressDock: boolean
  labelEls: (HTMLElement | null)[]
  flashEl: HTMLElement | null
  onModeChange: (mode: Mode) => void
  onDiveArrive: (hub: number) => void
}

export const HUB_COUNT = 6
