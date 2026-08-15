# content/blog

Durable archive of every post synced from Notion, including future-dated ones -
this directory is the source of truth for what's ever been published.

Files here are written by `npm run blog:sync` (see `scripts/sync-notion.mjs`),
not hand-authored. `scripts/build-blog.mjs` reads this directory at build time
and only ships posts whose `publishDate` has already passed - a post committed
here today with a date next month simply won't appear in `dist/` until a build
runs on or after that date.

Frontmatter shape:

```yaml
---
title: "Post title"
slug: post-title # frozen at first sync, never regenerated from title
publishDate: "2026-09-01" # YYYY-MM-DD, UTC
summary: "One-line summary, used in meta description, OG tags, and the index."
tags: ["engineering"]
notionPageId: "..." # sync join key, do not edit
notionLastEditedTime: "..." # sync idempotency check, do not edit
---
```
