import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'
import { location } from '../data/links'

const facts = [
  { label: 'Based in', value: location },
  { label: 'Currently', value: 'Tech Lead @ Zeal' },
  { label: 'Education', value: 'M.S. Computer Science, Binghamton University' },
  { label: 'Stack', value: 'React, TypeScript, Node.js, MongoDB, AWS' },
]

export function About() {
  return (
    <section id="about" className="border-b border-rule px-6 py-20 md:py-28">
      <div className="mx-auto max-w-4xl">
        <SectionHeading eyebrow="About" title="A little about me" />
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr]">
          <Reveal delay={0.1}>
            <p className="text-lg leading-relaxed text-ink-soft">
              I&apos;m a full-stack software engineer with seven-plus years of experience across startups and Google,
              currently building payroll and compliance products at{' '}
              <span className="font-semibold text-ink">Zeal</span>. I care most about the parts of engineering that
              users actually feel: page-load time, UI consistency, and features that quietly remove a manual step
              from someone&apos;s week.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              Outside of work I make YouTube videos, write TV reviews, and build small, slightly ridiculous
              JavaScript projects - you can find both in the{' '}
              <a href="#elsewhere" className="font-semibold text-ink underline decoration-rule underline-offset-4 hover:decoration-ink">
                elsewhere
              </a>{' '}
              section below.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <dl className="divide-y divide-rule border-t border-rule">
              {facts.map((f) => (
                <div key={f.label} className="flex items-baseline justify-between gap-4 py-3">
                  <dt className="font-body text-xs font-semibold uppercase tracking-[0.1em] text-ink-faint">
                    {f.label}
                  </dt>
                  <dd className="text-right font-body text-sm font-medium text-ink">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
