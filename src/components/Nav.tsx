import { links } from '../data/links'

const sections = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  // Projects temporarily hidden - re-add `{ href: '#projects', label: 'Projects' }` here to restore.
  { href: '#elsewhere', label: 'Elsewhere' },
  { href: '/blog/', label: 'Blog' },
]

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-paper/95 backdrop-blur">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <a href="#top" className="font-display text-lg italic tracking-tight">
          Sahil Kolwankar
        </a>
        <ul className="hidden items-center gap-7 font-body text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft md:flex">
          {sections.map((s) => (
            <li key={s.href}>
              <a href={s.href} className="transition-colors hover:text-ink">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href={links.resume}
          target="_blank"
          rel="noreferrer"
          className="border border-ink px-4 py-1.5 font-body text-xs font-semibold uppercase tracking-wide transition-colors hover:bg-ink hover:text-paper"
        >
          Resume
        </a>
      </nav>
    </header>
  )
}
