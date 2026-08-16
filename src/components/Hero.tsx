import { motion } from 'motion/react'
import { Mail } from 'lucide-react'
import { InstagramIcon, LinkedinIcon, XIcon } from './BrandIcons'
import { useTypewriter } from '../hooks/useTypewriter'
import { links, greetings, greetingHolds, greetingDeletes, greetingTypes, location } from '../data/links'

export function Hero() {
  const rotating = useTypewriter({
    words: greetings,
    holdMs: greetingHolds,
    deleteMs: greetingDeletes,
    typeMs: greetingTypes,
  })

  return (
    <section id="top" className="border-b border-rule px-6 pb-20 pt-16 md:pb-28 md:pt-24">
      <div className="mx-auto max-w-4xl">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-4 font-body text-xs font-semibold uppercase tracking-[0.18em] text-ink-faint"
        >
          Tech Lead &middot; {location}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-display text-[clamp(2.25rem,7vw,4.5rem)] leading-[1.1] tracking-tight text-balance"
        >
          Sahil Kolwankar
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          aria-hidden="true"
          className="mt-3 min-h-[1.6em] font-display text-xl italic text-ink-soft sm:text-2xl"
        >
          {rotating}
          <span className="type-cursor text-accent" aria-hidden="true">
            |
          </span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft"
        >
          I build things that quietly remove a manual step from someone&apos;s week - currently Tech Lead at Zeal,
          previously Vizibly, Google, and Tempus.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <a
            href="/blog/"
            className="border border-ink px-5 py-2.5 font-body text-sm font-semibold transition-colors hover:bg-ink hover:text-paper"
          >
            Read My Blog
          </a>
          <a
            href={links.resume}
            target="_blank"
            rel="noreferrer"
            className="border border-rule px-5 py-2.5 font-body text-sm font-semibold text-ink-soft transition-colors hover:border-ink hover:text-ink"
          >
            View Resume
          </a>
          <div className="ml-1 flex items-center gap-4">
            <a
              href={links.twitter}
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter / X"
              className="text-ink-soft transition-colors hover:text-ink"
            >
              <XIcon size={20} />
            </a>
            <a
              href={links.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="text-ink-soft transition-colors hover:text-ink"
            >
              <InstagramIcon size={20} />
            </a>
            {/* GitHub icon temporarily hidden here - re-import GithubIcon from './BrandIcons' and restore
                `<a href={links.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="text-ink-soft transition-colors hover:text-ink"><GithubIcon size={20} /></a>` above LinkedIn to bring it back. */}
            <a
              href={links.linkedIn}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="text-ink-soft transition-colors hover:text-ink"
            >
              <LinkedinIcon size={20} />
            </a>
            <a href={`mailto:${links.email}`} aria-label="Email" className="text-ink-soft transition-colors hover:text-ink">
              <Mail size={20} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
