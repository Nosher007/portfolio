import { Euler, Vector3 } from 'three'

export interface Graph {
  /** xyz per node; the first `hubCount` nodes are the hubs */
  positions: Float32Array
  /** Hub index (0..hubCount-1) a node is wired to, or -1 */
  nodeHub: Float32Array
  /** Pair of node indices per edge */
  edges: Uint16Array
  /** Hub index per edge vertex, or -1 */
  edgeHub: Float32Array
  neighbours: number[][]
  hubCount: number
  nodeCount: number
}

// Small deterministic PRNG so the network looks the same on every visit
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function buildGraph(ambientCount: number, hubCount: number): Graph {
  const rand = mulberry32(7)
  const nodeCount = hubCount + ambientCount
  const pts: Vector3[] = []

  // Hubs: octahedron vertices, tilted so none sit dead-centre or on the poles
  const tilt = new Euler(0.55, 0.45, 0.25)
  const octa = [
    [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1],
  ]
  for (let i = 0; i < hubCount; i++) {
    const [x, y, z] = octa[i % octa.length]
    pts.push(new Vector3(x, y, z).applyEuler(tilt).multiplyScalar(1.02))
  }

  // Ambient nodes: Fibonacci sphere with a little jitter in angle and radius
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < ambientCount; i++) {
    const y = 1 - (i / (ambientCount - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = golden * i + (rand() - 0.5) * 0.35
    const radius = 0.9 + rand() * 0.14
    pts.push(new Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(radius))
  }

  // Wire each node to its nearest neighbours; hubs get a denser fan of connections
  const neighbours: number[][] = pts.map(() => [])
  const edgeSet = new Set<string>()
  const edgeList: [number, number][] = []
  const addEdge = (a: number, b: number) => {
    const key = a < b ? `${a}-${b}` : `${b}-${a}`
    if (edgeSet.has(key)) return
    edgeSet.add(key)
    edgeList.push([a, b])
    neighbours[a].push(b)
    neighbours[b].push(a)
  }

  for (let i = 0; i < nodeCount; i++) {
    const k = i < hubCount ? 9 : 3
    const dists: [number, number][] = []
    for (let j = 0; j < nodeCount; j++) {
      if (j !== i) dists.push([pts[i].distanceToSquared(pts[j]), j])
    }
    dists.sort((a, b) => a[0] - b[0])
    for (let n = 0; n < k; n++) addEdge(i, dists[n][1])
  }

  const nodeHub = new Float32Array(nodeCount).fill(-1)
  for (let h = 0; h < hubCount; h++) {
    nodeHub[h] = h
    for (const n of neighbours[h]) if (n >= hubCount) nodeHub[n] = h
  }

  const positions = new Float32Array(nodeCount * 3)
  pts.forEach((p, i) => p.toArray(positions, i * 3))

  const edges = new Uint16Array(edgeList.length * 2)
  const edgeHub = new Float32Array(edgeList.length * 2)
  edgeList.forEach(([a, b], i) => {
    edges[i * 2] = a
    edges[i * 2 + 1] = b
    const hub = a < hubCount ? a : b < hubCount ? b : -1
    edgeHub[i * 2] = hub
    edgeHub[i * 2 + 1] = hub
  })

  return { positions, nodeHub, edges, edgeHub, neighbours, hubCount, nodeCount }
}
