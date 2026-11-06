import type { ReactNode } from 'react'

/** Browser-window chrome around a project visual */
export default function WindowFrame({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-ink-950">
      <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-3.5 py-2.5">
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="ml-3 truncate font-mono text-[10px] text-zinc-500">{caption}</span>
      </div>
      <div className="aspect-video overflow-hidden">{children}</div>
    </div>
  )
}
