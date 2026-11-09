/** Split a conventional-commit style PR title, e.g. "fix(graph): pass the path" */
export function parseTitle(title: string) {
  const clean = title.replace(/\s*\(#\d+\)\s*$/, '')
  const m = clean.match(/^(\w+)(?:\(([^)]+)\))?!?:\s*(.+)$/)
  return m ? { type: m[1].toLowerCase(), scope: m[2] ?? '', text: m[3] } : { type: '', scope: '', text: clean }
}

/** Colour per commit type, shared by the pipeline arcs and the type chips */
export const TYPE_COLOR: Record<string, string> = {
  feat: '#5ee6ff',
  fix: '#ffc26b',
  test: '#b9b0ff',
}
export const OTHER_COLOR = '#9b9bb2'
