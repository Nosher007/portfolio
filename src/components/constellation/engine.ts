import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Euler,
  Group,
  LineSegments,
  Points,
  MathUtils,
  PerspectiveCamera,
  Quaternion,
  ShaderMaterial,
  Vector3,
} from 'three'
import { buildGraph } from './graph'
import { HUB_COUNT, type Controller, type Mode } from './controller'

export const CAMERA_DIST = 10
const DIVE_MS = 1150
const FLASH_OUT_MS = 500

const VIOLET = new Color('#8b7cff')
const SOFT = new Color('#b9b0ff')
const CYAN = new Color('#5ee6ff')
const DIM = new Color('#6f6a9c')

/* ---------- shaders ---------- */

// Every vertex works out how far it sits towards the camera relative to the
// sphere centre, so the far side of the network fades into the background.
const frontChunk = /* glsl */ `
  vec4 world = modelMatrix * vec4(position, 1.0);
  vec4 center = modelMatrix * vec4(0.0, 0.0, 0.0, 1.0);
  float radius = length(modelMatrix[0].xyz);
  float front = clamp((world.z - center.z) / radius, -1.0, 1.0);
  vFade = mix(0.1, 1.0, smoothstep(-0.95, 0.85, front));
  vHl = 0.0;
  if (aHub > -0.5) vHl = uHighlight[int(aHub + 0.5)];
`

const pointVertex = /* glsl */ `
  uniform float uHighlight[${HUB_COUNT}];
  uniform float uPx;
  uniform float uMaxSize;
  uniform float uTime;
  uniform float uBreathe;
  uniform float uGrow;
  attribute float aSize;
  attribute float aHub;
  varying float vFade;
  varying float vHl;
  void main() {
    ${frontChunk}
    vec4 mv = viewMatrix * world;
    float persp = ${CAMERA_DIST.toFixed(1)} / max(-mv.z, 0.05);
    float breathe = 1.0 + uBreathe * 0.14 * sin(uTime * 2.4 + aHub * 1.9);
    gl_PointSize = min(aSize * uPx * (1.0 + vHl * uGrow) * breathe * persp, uMaxSize);
    gl_Position = projectionMatrix * mv;
  }
`

const pointFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uColorHi;
  uniform float uOpacity;
  uniform float uAlpha;
  uniform float uCore;
  varying float vFade;
  varying float vHl;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    float core = 1.0 - smoothstep(uCore * 0.6, uCore, d);
    float glow = pow(1.0 - d, 2.2) * 0.6;
    float a = (core + glow) * vFade * uOpacity * mix(uAlpha, 1.0, vHl);
    gl_FragColor = vec4(mix(uColor, uColorHi, vHl), a);
    #include <colorspace_fragment>
  }
`

const lineVertex = /* glsl */ `
  uniform float uHighlight[${HUB_COUNT}];
  attribute float aHub;
  varying float vFade;
  varying float vHl;
  void main() {
    ${frontChunk}
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

const lineFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uColorHi;
  uniform float uOpacity;
  uniform float uAlpha;
  varying float vFade;
  varying float vHl;
  void main() {
    float a = vFade * uOpacity * (uAlpha + vHl * 0.6);
    gl_FragColor = vec4(mix(uColor, uColorHi, vHl), a);
    #include <colorspace_fragment>
  }
`

/* ---------- helpers ---------- */

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const easeInCubic = (t: number) => t * t * t
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
const damp = (lambda: number, dt: number) => 1 - Math.exp(-lambda * dt)

function makeMaterial(
  vertexShader: string,
  fragmentShader: string,
  shared: Record<string, { value: unknown }>,
  own: Record<string, { value: unknown }>,
) {
  return new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: { ...shared, ...own },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  })
}

interface Rect {
  cx: number
  cy: number
  r: number
}

export interface FrameInfo {
  t: number
  dt: number
  width: number
  height: number
  dpr: number
  camera: PerspectiveCamera
}

/**
 * Owns every three.js object for the network and advances it each frame.
 * Kept outside React so the 60fps mutations don't fight the React Compiler.
 */
export class ConstellationEngine {
  readonly group = new Group()
  private readonly compact: boolean
  private readonly graph
  private readonly geometries: BufferGeometry[]
  private readonly materials
  private readonly shared
  private readonly highlight = new Array<number>(HUB_COUNT).fill(0)
  private readonly pulsePositions: Float32Array
  private readonly pulseGeo: BufferGeometry
  private readonly hubDirs: Vector3[]

  private readonly sim: {
    mode: Mode | null
    rect: Rect | null
    opacity: number
    spin: number
    spinSpeed: number
    tilt: { x: number; y: number }
    w: number
    qIdle: Quaternion
    qFocus: Quaternion
    snapNext: boolean
    flashOutAt: number
    pulses: { from: number; to: number; t: number; speed: number }[]
  }

  private readonly tmp = {
    v: new Vector3(),
    c: new Vector3(),
    z: new Vector3(0, 0, 1),
    euler: new Euler(),
    qT: new Quaternion(),
    qW: new Quaternion(),
    q: new Quaternion(),
  }

  constructor(compact: boolean) {
    this.compact = compact
    const graph = buildGraph(compact ? 150 : 280, HUB_COUNT)
    this.graph = graph
    const pulseCount = compact ? 26 : 52
    const { positions, nodeHub, edges, edgeHub, hubCount, nodeCount } = graph

    /* ----- geometry ----- */
    const ambientGeo = new BufferGeometry()
    const ambientCount = nodeCount - hubCount
    const sizes = new Float32Array(ambientCount)
    for (let i = 0; i < ambientCount; i++) sizes[i] = 0.9 + ((i * 7919) % 100) / 140
    ambientGeo.setAttribute('position', new BufferAttribute(positions.slice(hubCount * 3), 3))
    ambientGeo.setAttribute('aSize', new BufferAttribute(sizes, 1))
    ambientGeo.setAttribute('aHub', new BufferAttribute(nodeHub.slice(hubCount), 1))

    const hubGeo = new BufferGeometry()
    hubGeo.setAttribute('position', new BufferAttribute(positions.slice(0, hubCount * 3), 3))
    hubGeo.setAttribute('aSize', new BufferAttribute(new Float32Array(hubCount).fill(7), 1))
    hubGeo.setAttribute('aHub', new BufferAttribute(nodeHub.slice(0, hubCount), 1))

    const lineGeo = new BufferGeometry()
    const linePos = new Float32Array(edges.length * 3)
    edges.forEach((node, i) => {
      linePos[i * 3] = positions[node * 3]
      linePos[i * 3 + 1] = positions[node * 3 + 1]
      linePos[i * 3 + 2] = positions[node * 3 + 2]
    })
    lineGeo.setAttribute('position', new BufferAttribute(linePos, 3))
    lineGeo.setAttribute('aHub', new BufferAttribute(edgeHub, 1))

    this.pulsePositions = new Float32Array(pulseCount * 3)
    const pulseGeo = new BufferGeometry()
    pulseGeo.setAttribute('position', new BufferAttribute(this.pulsePositions, 3))
    pulseGeo.setAttribute('aSize', new BufferAttribute(new Float32Array(pulseCount).fill(2.6), 1))
    pulseGeo.setAttribute('aHub', new BufferAttribute(new Float32Array(pulseCount).fill(-1), 1))
    this.pulseGeo = pulseGeo

    this.hubDirs = Array.from({ length: hubCount }, (_, i) => new Vector3().fromArray(positions, i * 3).normalize())
    this.geometries = [ambientGeo, hubGeo, lineGeo, pulseGeo]

    /* ----- materials (uniform objects shared where it makes sense) ----- */
    const shared = {
      uHighlight: { value: this.highlight },
      uOpacity: { value: 0 },
      uPx: { value: 1 },
      uMaxSize: { value: 96 },
      uTime: { value: 0 },
    }
    this.shared = shared
    this.materials = {
      ambient: makeMaterial(pointVertex, pointFragment, shared, {
        uColor: { value: SOFT }, uColorHi: { value: CYAN }, uAlpha: { value: 0.7 },
        uCore: { value: 0.45 }, uBreathe: { value: 0 }, uGrow: { value: 0.7 },
      }),
      hubs: makeMaterial(pointVertex, pointFragment, shared, {
        uColor: { value: VIOLET }, uColorHi: { value: CYAN }, uAlpha: { value: 0.85 },
        uCore: { value: 0.32 }, uBreathe: { value: 1 }, uGrow: { value: 0.75 },
      }),
      lines: makeMaterial(lineVertex, lineFragment, shared, {
        uColor: { value: DIM }, uColorHi: { value: VIOLET }, uAlpha: { value: 0.22 },
      }),
      pulses: makeMaterial(pointVertex, pointFragment, { ...shared, uOpacity: { value: 0 } }, {
        uColor: { value: CYAN }, uColorHi: { value: CYAN }, uAlpha: { value: 1 },
        uCore: { value: 0.5 }, uBreathe: { value: 0 }, uGrow: { value: 0 },
      }),
    }

    const objects = [
      new LineSegments(lineGeo, this.materials.lines),
      new Points(ambientGeo, this.materials.ambient),
      new Points(pulseGeo, this.materials.pulses),
      new Points(hubGeo, this.materials.hubs),
    ]
    for (const o of objects) {
      o.frustumCulled = false
      this.group.add(o)
    }

    this.sim = {
      mode: null,
      rect: null,
      opacity: 0,
      spin: 0,
      spinSpeed: 0.11,
      tilt: { x: 0, y: 0 },
      w: 0,
      qIdle: new Quaternion(),
      qFocus: new Quaternion(),
      snapNext: false,
      flashOutAt: 0,
      pulses: Array.from({ length: pulseCount }, (_, i) => {
        const from = (i * 37) % nodeCount
        const nb = graph.neighbours[from]
        return { from, to: nb[i % nb.length], t: (i % 10) / 10, speed: 0.7 + ((i * 13) % 10) / 14 }
      }),
    }
  }

  dispose() {
    this.geometries.forEach((g) => g.dispose())
    Object.values(this.materials).forEach((m) => m.dispose())
  }

  /** Advances one frame. Returns false when nothing is visible, so drawing can be skipped. */
  update(c: Controller, frame: FrameInfo): boolean {
    const { sim: s, tmp, group: g, graph, highlight, hubDirs, pulsePositions, pulseGeo, shared, materials, compact } = this
    const dt = Math.min(frame.dt, 0.05)
    const t = frame.t
    const now = performance.now()
    const W = frame.width
    const H = frame.height
    const dpr = frame.dpr
    const camera = frame.camera

    /* --- 1. where should the sphere be? (DOM reads first, writes later) --- */
    const anchor = document.getElementById('constellation-anchor')
    const ar = anchor?.getBoundingClientRect()
    const heroVisible = !!ar && ar.width > 0 && ar.bottom > H * 0.38
    const footer = document.querySelector('footer')
    const footerVisible = !!footer && footer.getBoundingClientRect().top < H - 24

    let mode: Mode = heroVisible ? 'hero' : footerVisible || c.suppressDock ? 'hidden' : 'dock'
    if (c.dive) mode = 'hero'
    if (mode !== s.mode) {
      s.mode = mode
      c.mode = mode
      c.onModeChange(mode)
    }

    let target: Rect
    if (mode === 'hero' && ar && !c.dive) {
      target = { cx: ar.left + ar.width / 2, cy: ar.top + ar.height / 2, r: (Math.min(ar.width, ar.height) / 2) * 0.74 }
    } else if (mode === 'hero' && s.rect) {
      target = s.rect
    } else {
      const sizePx = c.dockExpanded ? (compact ? 200 : 236) : compact ? 76 : 100
      const margin = compact ? 14 : 22
      target = { cx: W - margin - sizePx / 2, cy: H - margin - sizePx / 2, r: (sizePx / 2) * 0.8 }
    }

    if (!s.rect || s.snapNext) {
      s.rect = { ...target }
      s.snapNext = false
    } else {
      const k = damp(mode === 'hero' && !c.dive ? 28 : 6.5, dt)
      s.rect.cx += (target.cx - s.rect.cx) * k
      s.rect.cy += (target.cy - s.rect.cy) * k
      s.rect.r += (target.r - s.rect.r) * k
    }
    s.opacity += ((mode === 'hidden' ? 0 : 1) - s.opacity) * damp(5, dt)

    /* --- 2. dive progress --- */
    let zoom = 1
    let toCentre = 0
    let flash = s.flashOutAt ? 1 - clamp01((now - s.flashOutAt) / FLASH_OUT_MS) : 0
    if (s.flashOutAt && flash <= 0) s.flashOutAt = 0
    if (c.dive) {
      const p = clamp01((now - c.dive.start) / DIVE_MS)
      zoom = 1 + easeInCubic(clamp01((p - 0.35) / 0.65)) * 8
      toCentre = easeInOut(clamp01((p - 0.3) / 0.5))
      flash = MathUtils.smoothstep(p, 0.68, 1)
      if (p >= 1) {
        const hub = c.dive.hub
        c.dive = null
        s.snapNext = true
        s.opacity = 0
        s.flashOutAt = now
        c.onDiveArrive(hub)
      }
    }
    if (c.flashEl) c.flashEl.style.opacity = flash.toFixed(3)

    /* --- 3. place the group in world space so it lines up with the rect --- */
    const unitsPerPx = (2 * Math.tan(MathUtils.degToRad(camera.fov / 2)) * CAMERA_DIST) / H
    const cx = MathUtils.lerp(s.rect.cx, W / 2, toCentre)
    const cy = MathUtils.lerp(s.rect.cy, H / 2, toCentre)
    // Shift the projection centre onto the sphere instead of moving the sphere
    // off-axis, so it stays perfectly round (no perspective skew) in a corner
    camera.setViewOffset(W, H, W / 2 - cx, H / 2 - cy, W, H)
    g.position.set(0, 0, 0)
    g.scale.setScalar(s.rect.r * unitsPerPx * zoom)

    /* --- 4. rotation: idle spin + pointer tilt, blended with "face this hub" --- */
    // While a hub is hovered the whole sphere freezes (spin, tilt and any
    // turn-to-face motion) so the target never slides away mid-click
    const frozen = c.hoverHub >= 0 && !c.dive
    if (frozen) {
      s.spinSpeed = 0
    } else {
      const spinTarget = c.reduced ? 0 : c.dockExpanded ? 0.015 : 0.11
      s.spinSpeed += (spinTarget - s.spinSpeed) * damp(3, dt)
      s.spin += dt * s.spinSpeed
      const tiltOn = mode === 'hero' && !c.reduced
      s.tilt.x += ((tiltOn ? c.pointer.y * 0.22 : 0) - s.tilt.x) * damp(3, dt)
      s.tilt.y += ((tiltOn ? c.pointer.x * 0.3 : 0) - s.tilt.y) * damp(3, dt)
      s.qIdle.setFromEuler(tmp.euler.set(0.32 + s.tilt.x, s.spin + s.tilt.y, 0.08))

      const focusTarget = c.dive
        ? c.dive.hub
        : c.focusHub >= 0
          ? c.focusHub
          : mode !== 'hero' && c.activeHub >= 0
            ? c.activeHub
            : -1
      if (s.w < 0.01) s.qFocus.copy(s.qIdle)
      if (focusTarget >= 0) {
        tmp.qT.setFromUnitVectors(hubDirs[focusTarget], tmp.z)
        const wobble = c.reduced || c.dive ? 0 : 1
        tmp.qW.setFromEuler(tmp.euler.set(0.1 * Math.sin(t * 0.4) * wobble, 0.28 * Math.sin(t * 0.25) * wobble, 0))
        tmp.qT.premultiply(tmp.qW)
        s.qFocus.slerp(tmp.qT, damp(c.dive ? 7 : 3, dt))
      }
      s.w += ((focusTarget >= 0 ? 1 : 0) - s.w) * damp(c.dive ? 6 : 2.4, dt)
      g.quaternion.copy(tmp.q.copy(s.qIdle).slerp(s.qFocus, s.w))
    }
    g.updateMatrixWorld()

    /* --- 5. hub highlights (hover, focus, current section, idle hint cycle) --- */
    const idleOn = mode === 'hero' && !c.reduced && c.hoverHub < 0 && c.focusHub < 0 && !c.dive && t > 2.5
    const idleHub = Math.floor(t / 2.8) % HUB_COUNT
    const idleLit = idleOn && t % 2.8 < 1.6
    let attract = -1
    for (let i = 0; i < HUB_COUNT; i++) {
      let goal = 0
      if (i === c.hoverHub || i === c.focusHub || (c.dive && i === c.dive.hub)) goal = 1
      else if (mode !== 'hero' && i === c.activeHub) goal = 1
      else if (idleLit && i === idleHub) goal = 0.8
      highlight[i] += (goal - highlight[i]) * damp(7, dt)
      if (highlight[i] > 0.5 && (attract < 0 || highlight[i] > highlight[attract])) attract = i
    }

    /* --- 6. signal pulses random-walk along edges, drawn towards a lit hub --- */
    const pos = graph.positions
    if (!c.reduced) {
      for (let i = 0; i < s.pulses.length; i++) {
        const p = s.pulses[i]
        p.t += dt * p.speed * (attract >= 0 ? 1.6 : 1)
        if (p.t >= 1) {
          p.t = 0
          const prev = p.from
          p.from = p.to
          const nb = graph.neighbours[p.from]
          let next = nb[Math.floor(Math.random() * nb.length)]
          if (attract >= 0 && Math.random() < 0.7) {
            let best = Infinity
            for (const n of nb) {
              const dx = pos[n * 3] - pos[attract * 3]
              const dy = pos[n * 3 + 1] - pos[attract * 3 + 1]
              const dz = pos[n * 3 + 2] - pos[attract * 3 + 2]
              const d = dx * dx + dy * dy + dz * dz
              if (d < best) {
                best = d
                next = n
              }
            }
          } else if (next === prev && nb.length > 1) {
            next = nb[(nb.indexOf(next) + 1) % nb.length]
          }
          // Reaching the lit hub: respawn somewhere random so the flow keeps going
          if (p.from === attract) {
            p.from = Math.floor(Math.random() * graph.nodeCount)
            next = graph.neighbours[p.from][0]
          }
          p.to = next
        }
        const a = p.from * 3
        const b = p.to * 3
        pulsePositions[i * 3] = pos[a] + (pos[b] - pos[a]) * p.t
        pulsePositions[i * 3 + 1] = pos[a + 1] + (pos[b + 1] - pos[a + 1]) * p.t
        pulsePositions[i * 3 + 2] = pos[a + 2] + (pos[b + 2] - pos[a + 2]) * p.t
      }
      pulseGeo.attributes.position.needsUpdate = true
    }

    /* --- 7. uniforms --- */
    shared.uOpacity.value = s.opacity
    shared.uTime.value = t
    shared.uPx.value = (Math.max(s.rect.r, 80) * dpr) / 78
    shared.uMaxSize.value = 90 * dpr
    materials.pulses.uniforms.uOpacity.value = c.reduced ? 0 : s.opacity * 0.9
    materials.lines.uniforms.uAlpha.value = mode === 'hero' ? 0.22 : 0.16

    /* --- 8. project hub positions to screen for the HTML labels --- */
    const labelsOn = !c.dive && s.opacity > 0.4 && (mode === 'hero' || (mode === 'dock' && c.dockExpanded))
    tmp.c.setFromMatrixPosition(g.matrixWorld)
    const radius = g.scale.x
    const menuOpen = mode === 'dock' && c.dockExpanded
    const placed: { el: HTMLElement; i: number; x: number; y: number; h: number; left: boolean; op: number }[] = []
    for (let i = 0; i < HUB_COUNT; i++) {
      const el = c.labelEls[i]
      if (!el) continue
      if (!labelsOn) {
        el.style.visibility = 'hidden'
        el.style.opacity = '0'
        continue
      }
      tmp.v.fromArray(pos, i * 3).applyMatrix4(g.matrixWorld)
      const front = (tmp.v.z - tmp.c.z) / radius
      tmp.v.project(camera)
      const sx = ((tmp.v.x + 1) / 2) * W
      const sy = ((1 - tmp.v.y) / 2) * H
      const left = sx < cx
      let op = i === c.focusHub ? 1 : MathUtils.smoothstep(front, -0.45, 0.15)
      // The open mini-map is a menu: every destination stays readable and clickable
      if (menuOpen) op = Math.max(op, 0.8)
      // Sit beside the node, but never past the edge of the screen
      const w = el.offsetWidth
      const x = MathUtils.clamp(left ? sx - 12 - w : sx + 12, 8, W - w - 8)
      placed.push({ el, i, x, y: sy, h: el.offsetHeight, left, op })
    }

    // Nudge labels on the same side apart so they never overlap
    for (const side of [true, false]) {
      const group = placed.filter((p) => p.left === side).sort((a, b) => a.y - b.y)
      for (let k = 1; k < group.length; k++) {
        const prev = group[k - 1]
        const cur = group[k]
        const minGap = (prev.h + cur.h) / 2 + 6
        if (cur.y - prev.y < minGap) cur.y = prev.y + minGap
      }
      // If the stack ran off the bottom, slide the whole column back up
      const last = group[group.length - 1]
      if (last) {
        const overflow = last.y + last.h / 2 + 8 - H
        if (overflow > 0) for (const p of group) p.y -= overflow
      }
    }

    for (const p of placed) {
      p.el.style.visibility = 'visible'
      p.el.style.opacity = p.op.toFixed(3)
      p.el.style.pointerEvents = p.op > 0.35 ? 'auto' : 'none'
      p.el.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0) translate(0, -50%)`
      p.el.dataset.lit = highlight[p.i] > 0.55 ? 'true' : 'false'
      p.el.dataset.side = p.left ? 'left' : 'right'
    }
    return s.opacity > 0.003
  }
}
