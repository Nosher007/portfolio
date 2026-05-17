/**
 * Extracts individual tech icons from the Figma composite Skills.svg sprite.
 * Each icon is clipped at a known rect — we re-render each one into its own
 * viewBox so it can be used as a standalone <img> or React component.
 *
 * Run: node scripts/extract-icons.mjs
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const src = readFileSync(join(root, 'src/assets/figma/Skills.svg'), 'utf8')

// Each entry: name, x, y, w, h (from clip-path translate values in the SVG)
// Row 1 — tech icons used in the template
const icons = [
  { name: 'javascript', x: 133,    y: 123, w: 56,  h: 56  },
  { name: 'typescript', x: 308.87, y: 123, w: 56,  h: 56  },
  { name: 'react',      x: 472.75, y: 123, w: 61,  h: 56  },
  { name: 'nextjs',     x: 629.44, y: 123, w: 56,  h: 56  },
  { name: 'nodejs',     x: 784.65, y: 123, w: 49,  h: 56  },
  { name: 'express',    x: 943.19, y: 123, w: 56,  h: 56  },
  { name: 'nestjs',     x: 1105.1, y: 123, w: 58,  h: 56  },
  { name: 'socketio',   x: 1265.5, y: 123, w: 56,  h: 56  },
  // Row 2
  { name: 'postgresql', x: 140.98, y: 271, w: 54,  h: 56  },
  { name: 'mongodb',    x: 330.44, y: 271, w: 26,  h: 56  },
  { name: 'sass',       x: 479.65, y: 271, w: 56,  h: 56  },
  { name: 'tailwindcss',x: 635.97, y: 271, w: 92,  h: 56  },
  { name: 'figma',      x: 825.69, y: 271, w: 37,  h: 56  },
  { name: 'cypress',    x: 956.35, y: 271, w: 56,  h: 56  },
  { name: 'storybook',  x: 1116.2, y: 271, w: 56,  h: 56  },
  { name: 'git',        x: 1273,   y: 271, w: 56,  h: 56  },
]

const outDir = join(root, 'src/assets/images/icons')
mkdirSync(outDir, { recursive: true })

for (const { name, x, y, w, h } of icons) {
  const pad = 4
  const vx = x - pad
  const vy = y - pad
  const vw = w + pad * 2
  const vh = h + pad * 2

  // Wrap the full sprite in a new SVG with a cropped viewBox
  const out = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="${vx} ${vy} ${vw} ${vh}" width="${vw}" height="${vh}">
${src.replace(/<svg[^>]*>/, '').replace('</svg>', '')}
</svg>`

  const file = join(outDir, `${name}.svg`)
  writeFileSync(file, out)
  console.log(`✓ ${name}.svg  (viewBox: ${vx} ${vy} ${vw} ${vh})`)
}

console.log(`\nDone — ${icons.length} icons extracted to src/assets/images/icons/`)
