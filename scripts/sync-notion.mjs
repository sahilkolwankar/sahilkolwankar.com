// Run locally, on demand, via `npm run blog:sync` (add `-- --dry-run` to preview
// with no writes/git activity). Never runs in CI - the Notion token only ever
// needs to exist in a local .env, never as a GitHub Actions secret.
//
// Pulls every Notion page with Status = Ready from the configured database,
// converts it to Markdown via Notion's own `pages.retrieveMarkdown` API,
// re-hosts any Notion-hosted images locally (their URLs expire), writes the
// result to content/blog/<slug>.md, and opens one PR per new/changed post via
// `gh pr create`. Nothing is ever pushed straight to master.
//
// --- One-time setup (see the project README / chat for the full walkthrough) ---
// 1. Create an integration at https://www.notion.so/my-integrations, copy its
//    "Internal Integration Secret".
// 2. Create a Notion database with exactly these properties:
//      - a title property (any name Notion gives it by default is fine)
//      - Status       (select: Draft / Ready / Published)
//      - Publish Date (date)
//      - Summary      (rich text)
//      - Tags         (multi-select, optional)
// 3. Share that database with the integration (··· menu -> Connections).
// 4. Create a local .env (gitignored) with:
//      NOTION_TOKEN=secret_...
//      NOTION_DATABASE_ID=...   (the 32-char id from the database URL)
//
// --- Idempotency rules ---
// - `notionPageId` is the join key between Notion pages and content/blog/*.md files.
// - `slug` is frozen at first sync (stored in frontmatter) and never regenerated
//   from the title later, so an in-Notion title edit can't break an already-shared URL.
// - If a page already has an open PR (branch `blog/<slug>`) AND has been edited in
//   Notion since that PR was opened, the script does NOT overwrite or silently skip -
//   it warns and names the PR, so edits are never lost and in-PR edits are never clobbered.
// - `Status` only controls what gets PR'd here. It does not control whether a merged
//   post is live - that's entirely `publishDate`, checked at build time (see
//   scripts/build-blog.mjs). A Ready post with a past publishDate goes live on the
//   very next scheduled rebuild after it's merged, regardless of Status.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import matter from 'gray-matter'
import { Client } from '@notionhq/client'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const CONTENT_DIR = join(ROOT, 'content', 'blog')
const IMAGES_DIR = join(ROOT, 'public', 'blog-images')
const DRY_RUN = process.argv.includes('--dry-run')

try {
  process.loadEnvFile(join(ROOT, '.env'))
} catch {
  console.error('No .env found. Create one with NOTION_TOKEN and NOTION_DATABASE_ID - see the header of this file.')
  process.exit(1)
}

const { NOTION_TOKEN, NOTION_DATABASE_ID } = process.env
if (!NOTION_TOKEN || !NOTION_DATABASE_ID) {
  console.error('.env is missing NOTION_TOKEN and/or NOTION_DATABASE_ID.')
  process.exit(1)
}

const notion = new Client({ auth: NOTION_TOKEN })

function sh(cmd, args, opts = {}) {
  return execFileSync(cmd, args, { cwd: ROOT, encoding: 'utf8', ...opts }).trim()
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function plainText(richText = []) {
  return richText.map((t) => t.plain_text).join('')
}

function readProperty(page, matchType) {
  return Object.values(page.properties).find((p) => p.type === matchType)
}

function existingPostBySlug(slug) {
  const path = join(CONTENT_DIR, `${slug}.md`)
  if (!existsSync(path)) return null
  const { data } = matter(readFileSync(path, 'utf8'))
  return { path, data }
}

function existingPostByNotionId(notionPageId) {
  if (!existsSync(CONTENT_DIR)) return null
  for (const file of readdirSync(CONTENT_DIR)) {
    if (!file.endsWith('.md') || file === 'README.md') continue
    const path = join(CONTENT_DIR, file)
    const { data } = matter(readFileSync(path, 'utf8'))
    if (data.notionPageId === notionPageId) return { path, data }
  }
  return null
}

function openPrForSlug(slug) {
  const out = sh('gh', ['pr', 'list', '--head', `blog/${slug}`, '--state', 'open', '--json', 'number,url'])
  const prs = JSON.parse(out || '[]')
  return prs[0] ?? null
}

async function downloadImage(url, slug, index) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to download image (${res.status}): ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())

  let ext = extname(new URL(url).pathname)
  if (!ext || ext.length > 5) {
    const type = res.headers.get('content-type') ?? ''
    ext = type.includes('png') ? '.png' : type.includes('webp') ? '.webp' : type.includes('gif') ? '.gif' : '.jpg'
  }

  const dir = join(IMAGES_DIR, slug)
  mkdirSync(dir, { recursive: true })
  const filename = `${index}${ext}`
  writeFileSync(join(dir, filename), buf)
  return `/blog-images/${slug}/${filename}`
}

async function rehostImages(markdown, slug) {
  const imagePattern = /!\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g
  let result = markdown
  let index = 0
  for (const match of markdown.matchAll(imagePattern)) {
    const [full, alt, url] = match
    index += 1
    try {
      const localPath = await downloadImage(url, slug, index)
      result = result.replace(full, `![${alt}](${localPath})`)
    } catch (err) {
      console.warn(`  ! Couldn't rehost image ${url}: ${err.message} (left pointing at Notion)`)
    }
  }
  return result
}

async function fetchReadyPages() {
  const db = await notion.databases.retrieve({ database_id: NOTION_DATABASE_ID })
  const dataSourceId = db.data_sources[0]?.id
  if (!dataSourceId) throw new Error('Database has no data source - is NOTION_DATABASE_ID correct?')

  const res = await notion.dataSources.query({
    data_source_id: dataSourceId,
    filter: { property: 'Status', select: { equals: 'Ready' } },
  })
  return res.results
}

async function syncPage(page) {
  const titleProp = readProperty(page, 'title')
  const dateProp = readProperty(page, 'date')
  const summaryProp = readProperty(page, 'rich_text')
  const tagsProp = readProperty(page, 'multi_select')

  const title = plainText(titleProp?.title)
  const publishDate = dateProp?.date?.start
  const summary = plainText(summaryProp?.rich_text)
  const tags = (tagsProp?.multi_select ?? []).map((t) => t.name)

  if (!title || !publishDate) {
    console.warn(`Skipping "${title || page.id}": needs a title and a Publish Date to sync.`)
    return
  }

  const existingById = existingPostByNotionId(page.id)
  const slug = existingById?.data.slug ?? slugify(title)
  const existing = existingById ?? existingPostBySlug(slug)

  if (existing && existing.data.notionLastEditedTime === page.last_edited_time) {
    console.log(`= "${title}" unchanged since last sync.`)
    return
  }

  const openPr = openPrForSlug(slug)
  if (openPr) {
    console.warn(
      `! "${title}" has newer Notion edits but PR #${openPr.number} is already open (${openPr.url}).\n` +
        `  Merge or close it, then re-run sync. Not touching this post.`,
    )
    return
  }

  console.log(`-> Syncing "${title}"...`)
  if (DRY_RUN) {
    console.log(`   (dry run - would write content/blog/${slug}.md and open a PR)`)
    return
  }

  const { markdown } = await notion.pages.retrieveMarkdown({ page_id: page.id })
  const body = await rehostImages(markdown, slug)

  const frontmatter = {
    title,
    slug,
    publishDate,
    summary,
    tags,
    notionPageId: page.id,
    notionLastEditedTime: page.last_edited_time,
  }
  mkdirSync(CONTENT_DIR, { recursive: true })
  writeFileSync(join(CONTENT_DIR, `${slug}.md`), matter.stringify(body, frontmatter))

  sh('git', ['checkout', '-b', `blog/${slug}`])
  sh('git', ['add', `content/blog/${slug}.md`, `public/blog-images/${slug}`])
  sh('git', ['commit', '-m', `blog: sync "${title}" from Notion`])
  sh('git', ['push', '-u', 'origin', `blog/${slug}`])
  sh('gh', [
    'pr',
    'create',
    '--title',
    `Blog: ${title}`,
    '--body',
    `Synced from Notion. Publishes ${publishDate} once merged and a rebuild runs.`,
    '--base',
    'master',
  ])
  sh('git', ['checkout', 'master'])
  console.log(`   Opened a PR for "${title}".`)
}

async function main() {
  if (!DRY_RUN) {
    const branch = sh('git', ['rev-parse', '--abbrev-ref', 'HEAD'])
    if (branch !== 'master') {
      console.error(`Must be on master to sync (currently on "${branch}"). Switch back and re-run.`)
      process.exit(1)
    }
    const status = sh('git', ['status', '--porcelain'])
    if (status) {
      console.error('Working tree has uncommitted changes. Commit or stash them before syncing.')
      process.exit(1)
    }
  }

  const pages = await fetchReadyPages()
  console.log(`Found ${pages.length} page(s) marked Ready in Notion.\n`)
  for (const page of pages) {
    await syncPage(page)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
