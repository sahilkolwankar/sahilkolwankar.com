import { Reveal } from './Reveal'

interface SectionHeadingProps {
  eyebrow: string
  title: string
}

export function SectionHeading({ eyebrow, title }: SectionHeadingProps) {
  return (
    <Reveal className="mb-12">
      <p className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
      <h2 className="font-display text-3xl tracking-tight md:text-4xl">{title}</h2>
      <div className="mt-6 h-px w-full bg-rule" />
    </Reveal>
  )
}
