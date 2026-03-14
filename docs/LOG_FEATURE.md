# log.10na.city — Developer Reference

Technical documentation for the blog/publishing feature built on top of the main Next.js app.

---

## Overview

The log feature is a file-based MDX blog. Posts are `.mdx` files in `content/posts/`. Routing lives at `/log` within the existing Next.js app, served at `log.10na.city` via a Vercel subdomain rewrite.

**Stack:**
- Next.js 14 App Router (same repo as main site)
- `next-mdx-remote/rsc` — server-side MDX rendering
- `gray-matter` — frontmatter parsing
- `reading-time` — auto read time calculation
- Tailwind CSS + custom `.prose-log` styles

---

## Directory Structure

```
content/
  posts/                          ← MDX source files (one file = one post)

app/
  log/
    layout.tsx                    ← shared header for all /log pages
    page.tsx                      ← post list index
    [slug]/
      page.tsx                    ← post detail + MDX renderer

components/
  mdx/
    PostImage.tsx                 ← basic full-width image
    CaptionImage.tsx              ← image with caption
    LayoutImage.tsx               ← image with 5 layout modes
    index.ts                      ← barrel export

lib/
  posts.ts                        ← core data layer: reads, parses, filters posts

app/
  globals.css                     ← .prose-log class for post body typography

next.config.mjs                   ← subdomain rewrite rule
PUBLISHING.md                     ← author-facing guide (keep intact)
docs/
  log-feature.md                  ← this file
```

---

## Data Layer — `lib/posts.ts`

All post reading/parsing goes through this file. Nothing else touches the filesystem directly.

**Exports:**

```ts
interface PostMeta {
  slug: string        // derived from filename (without .mdx)
  title: string       // from frontmatter
  date: string        // from frontmatter, format: YYYY-MM-DD
  description: string // from frontmatter
  tags: string[]      // from frontmatter
  published: boolean  // from frontmatter — false = draft
  readingTime: string // auto-calculated from content
}

interface Post extends PostMeta {
  content: string     // raw MDX string, passed to MDXRemote
}

getAllPosts(): PostMeta[]   // all published posts, sorted newest first
getPost(slug): Post | null // single post by slug, or null if not found
```

**How it works:**
1. Reads all `.mdx` files from `content/posts/`
2. Parses each with `gray-matter` to split frontmatter from content
3. Filters to `published: true` only
4. Sorts by `date` descending
5. Injects `readingTime` using the `reading-time` package

**Adding a field to all posts:**

1. Add it to the `PostMeta` interface in `lib/posts.ts`
2. Read it from `data` in both `getAllPosts()` and `getPost()`
3. Use it in `app/log/page.tsx` or `app/log/[slug]/page.tsx`

---

## Routing — `app/log/`

### `app/log/layout.tsx`

Wraps all `/log/*` pages with a shared header. Contains the "log." wordmark (links to `/log`) and a "10na.city →" back link.

No client-side logic. Pure server component.

### `app/log/page.tsx`

Post list index. Calls `getAllPosts()` at render time (server component — no `useEffect`, no fetch).

Renders:
- Page heading
- One list item per post: date, reading time, title, description, tags

### `app/log/[slug]/page.tsx`

Post detail page. Key implementation notes:

**Static generation:**
```ts
export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}
```
All published posts are pre-rendered at build time. Adding a new post and deploying generates a new static page.

**Metadata:**
```ts
export async function generateMetadata({ params }) {
  const post = getPost(params.slug)
  return { title: `${post.title} — log.10na.city`, description: post.description }
}
```

**MDX rendering:**
```ts
<MDXRemote source={post.content} components={mdxComponents} />
```
`post.content` is the raw MDX string from the file (everything after the frontmatter). `mdxComponents` is a plain object that maps component names to React components — no import needed inside post files.

**Draft guard:**
```ts
if (!post || !post.published) notFound()
```
Even if someone knows the URL, a draft post returns a 404.

---

## Global MDX Components

Components registered in `mdxComponents` in `app/log/[slug]/page.tsx` are available in every post without importing.

**Current registry:**

```ts
// app/log/[slug]/page.tsx
import { PostImage, CaptionImage, LayoutImage } from '@/components/mdx'

const mdxComponents = {
  PostImage,
  CaptionImage,
  LayoutImage,
}
```

**How to add a new component:**

1. Create `components/mdx/MyComponent.tsx`
2. Export it from `components/mdx/index.ts`
3. Import and add it to `mdxComponents` in `app/log/[slug]/page.tsx`
4. Use `<MyComponent />` in any `.mdx` post — no import required in the post file

---

## Image Components

All three live in `components/mdx/` and are globally registered.

### `PostImage`

Full-width image, no caption.

```tsx
// components/mdx/PostImage.tsx
interface PostImageProps {
  src: string   // path from /public
  alt: string
}
```

### `CaptionImage`

Full-width image with required caption below.

```tsx
// components/mdx/CaptionImage.tsx
interface CaptionImageProps {
  src: string
  alt: string
  caption: string
}
```

### `LayoutImage`

Image with layout control. The most flexible of the three.

```tsx
// components/mdx/LayoutImage.tsx
type Layout = 'full' | 'wide' | 'left' | 'right' | 'split'

interface LayoutImageProps {
  src: string
  alt: string
  caption?: string
  layout?: Layout   // defaults to 'full'
  src2?: string     // split layout only
  alt2?: string     // split layout only
}
```

| Layout | Behaviour |
|---|---|
| `full` | Full column width (default) |
| `wide` | Negative margin — bleeds wider than the text column |
| `left` | `float: left`, text wraps right. Use `<div style={{ clear: 'both' }} />` to end the wrap. |
| `right` | `float: right`, text wraps left. Same clear div needed. |
| `split` | Two images side by side using flexbox. Requires `src2` + `alt2`. |

---

## Typography — `.prose-log`

Post body content is wrapped in `<article className="prose-log">`. Styles are defined in `app/globals.css` (not Tailwind Typography plugin — deliberately avoided to keep control).

**Styled elements:** `p`, `h2`, `h3`, `ul`, `ol`, `li`, `strong`, `a`, `blockquote`, `code`, `pre`, `hr`

**Base styles:**
- Font: `var(--font-serif)` (Crimson Pro / Instrument Serif)
- Size: `1.125rem`
- Line height: `1.75`
- Color: `#37322f`

To adjust post body typography, edit the `.prose-log` block in `app/globals.css`.

---

## Subdomain Routing

`log.10na.city` is the same Next.js app as `10na.city`, routed via a rewrite in `next.config.mjs`:

```js
async rewrites() {
  return {
    beforeFiles: [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'log.10na.city' }],
        destination: '/log/:path*',
      },
      {
        source: '/',
        has: [{ type: 'host', value: 'log.10na.city' }],
        destination: '/log',
      },
    ],
  }
},
```

In production: add `log.10na.city` as a domain in Vercel project settings. The rewrite handles everything else.

In local dev: access at `localhost:3000/log` (subdomain routing doesn't apply locally).

---

## Build Behaviour

Posts are statically generated at build time (SSG). This means:

- **New post** → push → Vercel build → new static page generated → live
- **Deleted post** → push → page no longer generated → 404
- **Draft (`published: false`)** → not generated, 404 if accessed directly
- **No runtime database** — zero cold starts, instant page loads

The `image-components-demo.mdx` post is set to `published: false` and excluded from production. Set it to `true` locally to preview all image layouts.

---

## Dependencies Added

```json
"next-mdx-remote": "^5.x",
"gray-matter": "^4.x",
"reading-time": "^1.x"
```

All are server-side only — zero client bundle impact.
