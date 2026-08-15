import { ArrowUpRight, Tv } from 'lucide-react'
import { GithubIcon, InstagramIcon, LinkedinIcon, XIcon, YoutubeIcon } from './BrandIcons'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'
import { links } from '../data/links'

const spots = [
  { label: 'Twitter / X', description: 'Shorter thoughts, posted more often.', href: links.twitter, Icon: XIcon },
  { label: 'Instagram', description: 'Photography, mostly.', href: links.instagram, Icon: InstagramIcon },
  { label: 'YouTube', description: 'Videos I make in my spare time.', href: links.youtube, Icon: YoutubeIcon },
  { label: 'TV Reviews', description: 'A blog where I review TV shows.', href: links.tvReviews, Icon: Tv },
  { label: 'GitHub', description: 'Code, experiments, and side projects.', href: links.github, Icon: GithubIcon },
  { label: 'LinkedIn', description: 'My full professional history.', href: links.linkedIn, Icon: LinkedinIcon },
]

export function Elsewhere() {
  return (
    <section id="elsewhere" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-4xl">
        <SectionHeading eyebrow="Elsewhere" title="Find me around the web" />
        <div className="divide-y divide-rule border-t border-rule">
          {spots.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.04}>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-4 py-5"
              >
                <s.Icon size={18} className="shrink-0 text-ink-faint" />
                <span className="flex-1">
                  <span className="font-display text-lg">{s.label}</span>
                  <span className="ml-3 text-sm text-ink-faint">{s.description}</span>
                </span>
                <ArrowUpRight
                  size={16}
                  className="shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
                />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
