// Runs automatically as an npm `postbuild` hook, right after `vite build`.
//
// Reads every content/blog/*.md file, keeps only posts whose `publishDate`
// has already passed (UTC-normalized date comparison, not local time - so
// behavior doesn't depend on whether this runs on a laptop or in CI), and
// writes each eligible post as a genuinely static HTML file directly into
// dist/. Future-dated posts are never read into the output at all - not
// hidden client-side, structurally absent from that build's dist/.
//
// This is intentionally NOT part of the React app: no router, no hydration,
// no client JS for blog pages. Every route here is a real file GitHub Pages
// serves directly, and every route's content is fully known at build time,
// so there's nothing a router or client-side rendering would add.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeStringify from 'rehype-stringify'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const CONTENT_DIR = join(ROOT, 'content', 'blog')
const DIST_DIR = join(ROOT, 'dist')

const SITE_URL = existsSync(join(ROOT, 'public', 'CNAME'))
  ? `https://${readFileSync(join(ROOT, 'public', 'CNAME'), 'utf8').trim()}`
  : 'https://sahilkolwankar.com'

const SITE_NAME = 'Sahil Kolwankar'
const SITE_DESCRIPTION = 'Notes on software engineering, from Sahil Kolwankar.'

function todayUtc() {
  return new Date().toISOString().slice(0, 10)
}

function formatDate(isoDate) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${isoDate}T00:00:00Z`))
}

function escapeHtml(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Titles may mark a phrase for italic emphasis with *asterisks*, e.g.
// "Ownership *in the age* of AI". titleHtml() renders that as <em>; titlePlain()
// strips the markers for plain-text contexts (<title>, meta tags, RSS).
function titleHtml(title) {
  return escapeHtml(title).replace(/\*(.+?)\*/g, '<em>$1</em>')
}

function titlePlain(title) {
  return title.replace(/\*(.+?)\*/g, '$1')
}

function readEligiblePosts() {
  if (!existsSync(CONTENT_DIR)) return []

  const today = todayUtc()
  const posts = []

  for (const file of readdirSync(CONTENT_DIR)) {
    if (!file.endsWith('.md') || file === 'README.md') continue
    const raw = readFileSync(join(CONTENT_DIR, file), 'utf8')
    const { data, content } = matter(raw)

    if (!data.slug || !data.title || !data.publishDate) {
      console.warn(`[build-blog] Skipping ${file}: missing slug/title/publishDate frontmatter.`)
      continue
    }
    if (data.publishDate > today) continue // not live yet - excluded from this build entirely

    posts.push({
      slug: data.slug,
      title: data.title,
      publishDate: data.publishDate,
      summary: data.summary ?? '',
      tags: data.tags ?? [],
      body: content,
    })
  }

  return posts.sort((a, b) => (a.publishDate < b.publishDate ? 1 : -1))
}

function getCssHref() {
  const manifestPath = join(DIST_DIR, '.vite', 'manifest.json')
  if (!existsSync(manifestPath)) {
    console.warn('[build-blog] No Vite manifest found (is build.manifest enabled?) - blog pages will ship unstyled.')
    return null
  }
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  const entry = Object.values(manifest).find((e) => e.isEntry && e.css?.length)
  return entry ? `/${entry.css[0]}` : null
}

async function renderMarkdown(md) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeExternalLinks, { target: '_blank', rel: ['noreferrer'] })
    .use(rehypeStringify)
    .process(md)
  return String(file)
}

function layout({ title, description, path, bodyHtml, cssHref }) {
  const canonical = `${SITE_URL}${path}`
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${canonical}" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="alternate" type="application/rss+xml" title="${escapeHtml(SITE_NAME)}" href="${SITE_URL}/rss.xml" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta name="twitter:card" content="summary" />
    ${cssHref ? `<link rel="stylesheet" href="${cssHref}" />` : ''}
  </head>
  <body class="bg-paper text-ink font-body">
    <header class="sticky top-0 z-50 border-b border-rule bg-paper/95 backdrop-blur">
      <nav class="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <a href="/" class="font-display text-lg italic tracking-tight">Sahil Kolwankar</a>
        <ul class="hidden items-center gap-7 font-body text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft md:flex">
          <li><a href="/#about" class="transition-colors hover:text-ink">About</a></li>
          <li><a href="/#experience" class="transition-colors hover:text-ink">Experience</a></li>
          <!-- Projects temporarily hidden - restore the /#projects link here to match Nav.tsx when re-enabling. -->
          <li><a href="/#elsewhere" class="transition-colors hover:text-ink">Elsewhere</a></li>
          <li><a href="/blog/" class="text-ink">Blog</a></li>
        </ul>
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noreferrer"
          class="border border-ink px-4 py-1.5 font-body text-xs font-semibold uppercase tracking-wide transition-colors hover:bg-ink hover:text-paper"
          >Resume</a
        >
      </nav>
    </header>
    <main>${bodyHtml}</main>
    <footer class="border-t border-rule px-6 py-10">
      <div class="mx-auto flex max-w-4xl flex-col items-center gap-3 text-center">
        <a href="mailto:sahilkolwankar@gmail.com" class="font-display text-lg hover:text-accent"
          >sahilkolwankar@gmail.com</a
        >
        <p class="text-xs text-ink-faint">&copy; ${new Date().getUTCFullYear()} Sahil Kolwankar</p>
      </div>
    </footer>
  </body>
</html>
`
}

function renderFeatured(post) {
  return `
    <a href="/blog/${post.slug}/" class="mb-10 block border-b-2 border-ink pb-8">
      <p class="mb-2 font-mono text-xs text-ink-faint">latest &middot; ${formatDate(post.publishDate)}</p>
      <h2 class="font-display text-3xl leading-tight tracking-tight md:text-4xl">${titleHtml(post.title)}</h2>
      ${post.summary ? `<p class="mt-3 text-lg text-ink-soft">${escapeHtml(post.summary)}</p>` : ''}
      <span class="mt-3 inline-block font-body text-sm font-semibold text-accent">Read the post &rarr;</span>
    </a>`
}

function renderFilterableTable(posts) {
  const tags = [...new Set(posts.flatMap((p) => p.tags))]

  const chipsHtml = tags
    .map(
      (t) =>
        `<button type="button" class="tag-chip border border-rule px-3.5 py-1.5 font-body text-xs font-semibold text-ink-soft transition-colors" data-tag="${escapeHtml(t)}">${escapeHtml(t)}</button>`,
    )
    .join('')

  const rowsHtml = posts
    .map(
      (p) => `
        <tr data-tags="${escapeHtml(p.tags.join(','))}" class="border-b border-rule">
          <td class="whitespace-nowrap py-3 pr-2 font-mono text-ink-soft">${formatDate(p.publishDate)}</td>
          <td class="py-3 px-2"><a href="/blog/${p.slug}/" class="font-medium transition-colors hover:text-accent">${titleHtml(p.title)}</a></td>
          <td class="py-3 pl-2 text-right font-mono text-ink-faint">${escapeHtml(p.tags.join(', '))}</td>
        </tr>`,
    )
    .join('')

  const filterUi = tags.length
    ? `<div class="mb-4 flex flex-wrap items-center gap-2">${chipsHtml}<span id="clear-filters" class="ml-1 hidden cursor-pointer font-body text-xs font-semibold text-accent underline">Clear filters</span></div>`
    : ''

  const script = tags.length
    ? `<script>
      (function () {
        var chips = document.querySelectorAll('.tag-chip')
        var rows = document.querySelectorAll('#post-table-body tr[data-tags]')
        var clearBtn = document.getElementById('clear-filters')
        function applyFilter() {
          var active = Array.prototype.filter
            .call(chips, function (c) { return c.classList.contains('is-active') })
            .map(function (c) { return c.dataset.tag })
          rows.forEach(function (r) {
            var tags = r.dataset.tags.split(',')
            var show = active.length === 0 || tags.some(function (t) { return active.indexOf(t) !== -1 })
            r.style.display = show ? '' : 'none'
          })
          clearBtn.classList.toggle('hidden', active.length === 0)
        }
        chips.forEach(function (c) {
          c.addEventListener('click', function () {
            c.classList.toggle('is-active')
            c.classList.toggle('bg-ink')
            c.classList.toggle('text-paper')
            c.classList.toggle('border-ink')
            applyFilter()
          })
        })
        clearBtn.addEventListener('click', function () {
          chips.forEach(function (c) { c.classList.remove('is-active', 'bg-ink', 'text-paper', 'border-ink') })
          applyFilter()
        })
      })()
    </script>`
    : ''

  return `
    ${filterUi}
    <table class="w-full border-collapse text-sm">
      <thead>
        <tr class="border-b border-ink">
          <th class="py-2 pr-2 text-left font-mono text-xs text-ink-faint">date</th>
          <th class="py-2 px-2 text-left font-mono text-xs text-ink-faint">title</th>
          <th class="py-2 pl-2 text-right font-mono text-xs text-ink-faint">tags</th>
        </tr>
      </thead>
      <tbody id="post-table-body">${rowsHtml}</tbody>
    </table>
    ${script}`
}

function renderIndexPage(posts, cssHref) {
  let content
  if (!posts.length) {
    content = `<p class="py-6 text-ink-soft">No posts yet - check back soon.</p>`
  } else {
    const [featured, ...rest] = posts
    content = renderFeatured(featured) + (rest.length ? renderFilterableTable(rest) : '')
  }

  const body = `
    <section class="border-b border-rule px-6 py-20 md:py-28">
      <div class="mx-auto max-w-4xl">
        <p class="mb-3 font-body text-xs font-semibold uppercase tracking-[0.18em] text-accent">Blog</p>
        <h1 class="font-display text-4xl tracking-tight md:text-5xl">Writing</h1>
        <div class="mt-10">${content}</div>
      </div>
    </section>`

  return layout({
    title: `Blog - ${SITE_NAME}`,
    description: SITE_DESCRIPTION,
    path: '/blog/',
    bodyHtml: body,
    cssHref,
  })
}

function renderPostPage(post, cssHref) {
  const meta = [formatDate(post.publishDate), ...post.tags].join(' &middot; ')
  const body = `
    <article class="border-b border-rule px-6 py-20 md:py-28">
      <div class="mx-auto max-w-2xl">
        <p class="mb-3 font-mono text-xs text-ink-faint">${meta}</p>
        <h1 class="font-display text-4xl tracking-tight md:text-5xl">${titleHtml(post.title)}</h1>
        ${post.summary ? `<p class="mt-4 text-lg text-ink-soft">${escapeHtml(post.summary)}</p>` : ''}
        <div class="prose prose-lg font-article mt-10 max-w-none prose-headings:font-heading-sm prose-headings:font-normal prose-headings:tracking-tight prose-p:text-ink-soft prose-p:leading-[1.6] prose-p:my-[0.75em] prose-li:text-ink-soft prose-li:leading-[1.6] prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-strong:text-ink prose-code:font-mono prose-code:text-ink prose-blockquote:border-accent prose-blockquote:text-ink-soft prose-img:rounded-none">
          ${post.renderedHtml}
        </div>
        <p class="mt-16">
          <a href="/blog/" class="font-body text-sm font-semibold underline decoration-rule underline-offset-4 hover:decoration-ink">&larr; Back to all posts</a>
        </p>
      </div>
    </article>`

  return layout({
    title: `${titlePlain(post.title)} - ${SITE_NAME}`,
    description: post.summary || SITE_DESCRIPTION,
    path: `/blog/${post.slug}/`,
    bodyHtml: body,
    cssHref,
  })
}

function writeRss(posts) {
  const items = posts
    .map(
      (p) => `
    <item>
      <title>${escapeHtml(titlePlain(p.title))}</title>
      <link>${SITE_URL}/blog/${p.slug}/</link>
      <guid>${SITE_URL}/blog/${p.slug}/</guid>
      <pubDate>${new Date(`${p.publishDate}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${escapeHtml(p.summary)}</description>
    </item>`,
    )
    .join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeHtml(SITE_NAME)}</title>
    <link>${SITE_URL}/blog/</link>
    <description>${escapeHtml(SITE_DESCRIPTION)}</description>${items}
  </channel>
</rss>
`
  writeFileSync(join(DIST_DIR, 'rss.xml'), rss)
}

function writeSitemap(posts) {
  const urls = [
    `${SITE_URL}/`,
    `${SITE_URL}/blog/`,
    ...posts.map((p) => `${SITE_URL}/blog/${p.slug}/`),
  ]
    .map((u) => `  <url><loc>${u}</loc></url>`)
    .join('\n')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
  writeFileSync(join(DIST_DIR, 'sitemap.xml'), sitemap)
}

async function main() {
  if (!existsSync(DIST_DIR)) {
    console.warn('[build-blog] dist/ not found - run `vite build` first. Skipping.')
    return
  }

  const posts = readEligiblePosts()
  const cssHref = getCssHref()

  for (const post of posts) {
    post.renderedHtml = await renderMarkdown(post.body)
    const postDir = join(DIST_DIR, 'blog', post.slug)
    mkdirSync(postDir, { recursive: true })
    writeFileSync(join(postDir, 'index.html'), renderPostPage(post, cssHref))
  }

  mkdirSync(join(DIST_DIR, 'blog'), { recursive: true })
  writeFileSync(join(DIST_DIR, 'blog', 'index.html'), renderIndexPage(posts, cssHref))

  writeRss(posts)
  writeSitemap(posts)

  console.log(`[build-blog] Wrote ${posts.length} published post(s) to dist/blog/.`)
}

main()
