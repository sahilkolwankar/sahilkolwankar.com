export interface ExperienceEntry {
  company: string
  role: string
  period: string
  logo?: string
  summary?: string
  bullets: string[]
  stack: string[]
}

export const experience: ExperienceEntry[] = [
  {
    company: 'Zeal',
    role: 'Tech Lead',
    period: 'Jun 2026 - Present',
    logo: '/images/logos/zeal-logo.svg',
    summary:
      "Owning engineering architecture and technical direction across Zeal's payments, tax, and onboarding systems, and mentoring engineers across the team.",
    bullets: [
      "Leading the architecture for migrating Zeal's banking partner: tracing how internal accounts, counterparties, and payment rails resolve in the codebase; designing the transfer-rail strategy for network versus book transfers during the dual-bank window and a per-company cutover; coordinating open questions with the processor; and writing the migration policy and runbook, covering roughly 120K counterparties and ten money-movement flows.",
      'Shaping how the team adopts AI tools responsibly - evaluating tooling, building custom review skills and workflows, and automating quality gates: PR-review rules that catch security issues, duplicate logic, and pattern drift, plus checks that keep API docs in sync with the routes they describe.',
      'Led an incident-driven Redis reliability and security effort: root-caused a silent consumer stall that had dropped around 5,700 money-movement webhooks with no alert firing, closed the gap with revised stream-retention caps, and eliminated harmful redundancy.',
      'Mentoring engineers, including a junior tax engineer partnering with the tax team on New Hire Reporting and tax deadline and payment architecture; running knowledge-sharing sessions; setting team norms for owning AI-assisted work; and tracking vendor costs across AWS, MongoDB, Redis, Smarty, and Cursor.',
    ],
    stack: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'AWS'],
  },
  {
    company: 'Zeal',
    role: 'Senior Software Engineer',
    period: 'Oct 2023 - Jun 2026',
    logo: '/images/logos/zeal-logo.svg',
    summary:
      "Lead payments engineer and core tax engineer on Zeal's YC-backed embedded-payroll platform - the systems that move customer money and handle legal filings.",
    bullets: [
      'Refactored the KYC-compliant payment path so KYC is enforced before every payout and payouts are idempotent, revamped worker onboarding into a modular on-demand framework, and built the usage-based billing logic behind products like I-9 and custom paperwork.',
      "Led engineering for Zeal's I-9 and E-Verify offering - case lifecycle, partner webhooks, and reporting - and architected payroll and tax support for contractor-only (1099) companies, opening a new customer segment.",
      "Built the federal overtime calculator computing the FLSA-defined overtime premium and the W-2 reporting for qualified overtime and tips, after the 2025 \"No Tax on Overtime\" and \"No Tax on Tips\" deductions became law.",
      'Designed and built a system of secure, login-free tokenized links so workers can complete onboarding tasks - bank info, paycards, profile, account creation, custom paperwork - without a full account.',
      'Found a class of silent failure modes across the app and revamped alerting for wallet transfers, banking, E-Verify, duplicate tax-engine checks, and missed new-hire reports, so critical failures get caught instead of discovered later.',
    ],
    stack: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'React Query', 'LaunchDarkly', 'AWS'],
  },
  {
    company: 'Vizibly',
    role: 'Senior Software Engineer',
    period: 'Mar 2023 - Oct 2023',
    logo: '/images/logos/vizibly-logo.png',
    bullets: [
      'Engineered a dynamic formula bar for customizing property drivers - cut budgeting errors by 50% and saved users ~22 hours/week.',
      'Built an editor for thousands of rows using virtual scrolling and optimized transactions, reducing onboarding time by 40%.',
      'Worked directly with the founding team to ship 3 new features in 4 months.',
    ],
    stack: ['React', 'TypeScript', 'GraphQL', 'Prisma', 'AWS', 'Python'],
  },
  {
    company: 'Google · YouTube Living Room',
    role: 'Software Engineer',
    period: 'Aug 2022 - Mar 2023',
    logo: '/images/logos/google-logo.svg',
    bullets: [
      'Led credential-transfer work for a YouTube Shorts casting project and authored the implementation design doc.',
      'Built "playback awareness," a cast device sharing feature, and maintained YouTube / YouTube Music on Nest devices.',
      'Resolved a P0 bug affecting 5% of Nest Hub users while on call; contributed to the YouTube iOS app.',
    ],
    stack: ['TypeScript', 'Java', 'Objective-C', 'Xcode'],
  },
  {
    company: 'Egen Solutions (client: Tempus Labs)',
    role: 'Software Engineer',
    period: 'Jul 2019 - Aug 2022',
    logo: '/images/logos/tempus-logo.png',
    bullets: [
      'Led a cross-team UI revamp to cut loading time and give users more control, for a health-tech client.',
      'Built the front end of a data-driven application with React, Redux, and D3.js, and a RESTful API in Flask.',
      'Contributed to the data engineering pipeline with Airflow and GCP; maintained Terraform for infra-as-code.',
    ],
    stack: ['React', 'Redux', 'TypeScript', 'D3.js', 'Python', 'Flask', 'Airflow', 'GCP'],
  },
  {
    company: 'StratiFi Technologies',
    role: 'Software Engineer, Intern',
    period: 'May 2018 - Aug 2018',
    logo: '/images/logos/stratifi-logo.svg',
    bullets: [
      'Built UI for multiple projects at a San Francisco fintech startup using React, Redux, and Bootstrap.',
      'Led the migration of a large static marketing site to WP-Engine and set up Mailchimp forms for subscribers.',
    ],
    stack: ['React', 'Redux', 'Django REST Framework', 'Bootstrap', 'Docker'],
  },
]
