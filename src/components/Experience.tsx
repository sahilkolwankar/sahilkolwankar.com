import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'
import { experience } from '../data/experience'
import { links } from '../data/links'

export function Experience() {
  return (
    <section id="experience" className="border-b border-rule px-6 py-20 md:py-28">
      <div className="mx-auto max-w-4xl">
        <SectionHeading eyebrow="Experience" title="Where I've worked" />
        <div className="divide-y divide-rule border-t border-rule">
          {experience.map((job, i) => (
            <Reveal key={job.company} delay={Math.min(i * 0.04, 0.2)}>
              <div className="grid gap-2 py-8 md:grid-cols-[200px_1fr] md:gap-8">
                <div className="flex items-center gap-3 md:block">
                  {job.logo && (
                    <img
                      src={job.logo}
                      alt={`${job.company} logo`}
                      className="h-6 w-auto max-w-[120px] object-contain object-left grayscale"
                    />
                  )}
                  <p className="font-body text-xs font-semibold uppercase tracking-[0.1em] text-ink-faint md:mt-3">
                    {job.period}
                  </p>
                </div>
                <div>
                  <h3 className="font-display text-xl">
                    {job.role} <span className="text-ink-faint">&middot; {job.company}</span>
                  </h3>
                  {job.summary && <p className="mt-2 leading-relaxed text-ink-soft">{job.summary}</p>}
                  <ul className="mt-3 space-y-2.5 text-ink-soft">
                    {job.bullets.map((b) => (
                      <li key={b} className="flex gap-3 leading-relaxed">
                        <span className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-ink-faint" aria-hidden="true" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 font-body text-xs uppercase tracking-[0.08em] text-ink-faint">
                    {job.stack.join(' · ')}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1} className="mt-8">
          <a
            href={links.linkedIn}
            target="_blank"
            rel="noreferrer"
            className="font-body text-sm font-semibold underline decoration-rule underline-offset-4 hover:decoration-ink"
          >
            See the full history on LinkedIn &rarr;
          </a>
        </Reveal>
      </div>
    </section>
  )
}
