export interface ProjectEntry {
  name: string
  description: string
  url: string
  demoUrl?: string
  stack: string[]
  /** true if the description was drafted by Claude and should be reviewed/rewritten */
  needsReview?: boolean
}

export const projects: ProjectEntry[] = [
  {
    name: 'Music Visualizer',
    description: 'A web app that turns an MP3 into a live, reactive visualization, built with D3.js.',
    url: 'https://github.com/sahilkolwankar/music-visualizer',
    stack: ['JavaScript', 'D3.js', 'Web Audio API'],
  },
  {
    name: 'Thread Exporter',
    description: 'A TypeScript utility for exporting conversation threads into a portable format.',
    url: 'https://github.com/sahilkolwankar/thread-exporter',
    stack: ['TypeScript'],
    needsReview: true,
  },
  {
    name: 'Craigslist Scraper',
    description: 'A Python scraper that pulls and structures Craigslist listings for further analysis.',
    url: 'https://github.com/sahilkolwankar/craigslist-scraper',
    stack: ['Python'],
    needsReview: true,
  },
]
