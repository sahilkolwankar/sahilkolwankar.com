import type { ReactNode } from 'react'

export function Highlight({ children }: { children: ReactNode }) {
  return (
    // z-0 is load-bearing: it gives this span its own stacking context so the
    // bar's negative z-index stays local (behind the text) instead of escaping
    // to the nearest ancestor stacking context and painting behind the page.
    <span className="relative z-0 inline-block whitespace-nowrap">
      {children}
      <span className="absolute -left-1 -right-1 bottom-[0.25em] -z-10 h-[0.68em] rotate-[-1.5deg] bg-highlight" aria-hidden="true" />
    </span>
  )
}
