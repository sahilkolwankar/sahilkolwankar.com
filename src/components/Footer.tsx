import { links } from '../data/links'

export function Footer() {
  return (
    <footer className="border-t border-rule px-6 py-10">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 text-center">
        <a href={`mailto:${links.email}`} className="font-display text-lg hover:text-accent">
          {links.email}
        </a>
        <p className="text-xs text-ink-faint">&copy; {new Date().getFullYear()} Sahil Kolwankar</p>
      </div>
    </footer>
  )
}
