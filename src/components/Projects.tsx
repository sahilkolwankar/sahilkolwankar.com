import { ArrowUpRight } from 'lucide-react'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'
import { projects } from '../data/projects'

export function Projects() {
  return (
    <section id="projects" className="border-b border-rule px-6 py-20 md:py-28">
      <div className="mx-auto max-w-4xl">
        <SectionHeading eyebrow="Projects" title="Things I've built" />
        <div className="divide-y divide-rule border-t border-rule">
          {projects.map((p, i) => (
            <Reveal key={p.name} delay={Math.min(i * 0.03, 0.18)}>
              <a
                href={p.demoUrl ?? p.url}
                target="_blank"
                rel="noreferrer"
                className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 py-6"
              >
                <span className="font-body text-sm text-ink-faint">{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <span className="font-display text-xl underline decoration-transparent decoration-2 underline-offset-4 transition-colors group-hover:decoration-ink">
                    {p.name}
                  </span>
                  <span className="mt-1 block text-ink-soft">{p.description}</span>
                  <span className="mt-2 block font-body text-xs uppercase tracking-[0.08em] text-ink-faint">
                    {p.stack.join(' · ')}
                  </span>
                </span>
                <ArrowUpRight
                  size={18}
                  className="text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
                />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
