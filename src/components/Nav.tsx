import { useState } from 'react'
import { links } from '../data/links'

const sections = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  // Projects temporarily hidden - re-add `{ href: '#projects', label: 'Projects' }` here to restore.
  { href: '#elsewhere', label: 'Elsewhere' },
  { href: '/blog/', label: 'Blog' },
]

export function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-paper/95 backdrop-blur">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <a href="#top" onClick={() => setOpen(false)} className="font-display text-lg italic tracking-tight">
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
          className="hidden border border-ink px-4 py-1.5 font-body text-xs font-semibold uppercase tracking-wide transition-colors hover:bg-ink hover:text-paper md:inline-block"
        >
          Resume
        </a>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="relative h-4 w-6 md:hidden"
        >
          <span
            className={`absolute left-0 h-[2px] w-full bg-ink transition-transform duration-200 ${open ? 'top-[7px] rotate-45' : 'top-0'}`}
          />
          <span
            className={`absolute left-0 top-[7px] h-[2px] w-full bg-ink transition-opacity duration-200 ${open ? 'opacity-0' : 'opacity-100'}`}
          />
          <span
            className={`absolute left-0 h-[2px] w-full bg-ink transition-transform duration-200 ${open ? 'top-[7px] -rotate-45' : 'top-3.5'}`}
          />
        </button>
      </nav>
      {open && (
        <div className="absolute inset-x-0 top-full border-b border-rule bg-paper px-6 pb-6 pt-2 md:hidden">
          <ul className="divide-y divide-rule border-t border-rule">
            {sections.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  onClick={() => setOpen(false)}
                  className="block py-3.5 font-display text-lg italic text-ink"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={links.resume}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            className="mt-4 block border border-ink px-4 py-2.5 text-center font-body text-xs font-semibold uppercase tracking-wide"
          >
            Resume
          </a>
        </div>
      )}
    </header>
  )
}
