# log.10na.city — Developer Reference

Technical documentation for the log.10na.city blog — a standalone Next.js app deployed separately from the main 10na.city site.

---

## Architecture

This is a **dedicated Next.js app** for `log.10na.city`. It lives on the `feature/log` branch and is deployed as its own Vercel project pointed at that branch. There is no shared routing or rewrites with the main site — clean separation of concerns, independent SEO signals.

**Stack:**
- Next.js 14 App Router
- `next-mdx-remote/rsc` — server-side MDX rendering
- `gray-matter` — frontmatter parsing
- `reading-time` — auto read time calculation
- Tailwind CSS + custom `.prose-log` styles
- `next/og` — dynamic per-post OG images (edge runtime)

---

## Directory Structure

```
content/
  posts/                          ← MDX source files (one file = one post)

app/
  layout.tsx                      ← root layout: header, footer, PWA meta, app shell
  loading.tsx                     ← Tenacity-branded loading state (log. animation)
  page.tsx                        ← homepage — paginated post list (page 1)
  [slug]/
    page.tsx                      ← post detail + MDX renderer + author + related
    opengraph-image.tsx           ← dynamic OG image per post (edge)
  page/
    [page]/
      page.tsx                    ← paginated list pages (/page/2, /page/3 …)
  tag/
    [tag]/
      page.tsx                    ← filtered post list by tag
  feed.xml/
    route.ts                      ← RSS 2.0 feed
  sitemap.ts                      ← dynamic XML sitemap
  robots.ts                       ← robots.txt

components/
  mdx/
    PostImage.tsx                 ← basic full-width image
    CaptionImage.tsx              ← image with caption
    LayoutImage.tsx               ← image with 5 layout modes
    Heading.tsx                   ← h2/h3 with anchor # links for deep linking
    index.ts                      ← barrel export
  log/
    author-card.tsx               ← author bio card shown below each post
    related-posts.tsx             ← "Continue reading" section (tag-matched)
    searchable-posts.tsx          ← client component: search input + post list
    pagination.tsx                ← prev/next nav (/ → /page/2 → /page/3 …)

lib/
  posts.ts                        ← core data layer: reads, parses, filters, paginates posts
  authors.ts                      ← author registry (slug → Author object)

public/
  manifest.json                   ← PWA manifest (installable as mobile app)
  people/                         ← author profile images

docs/
  LOG_FEATURE.md                  ← this file
  PUBLISHING.md                   ← author-facing publishing guide

CLAUDE.md                         ← quick context for AI assistants
NOTE.md                           ← ongoing build notes and backlog
```

---

## Data Layer — `lib/posts.ts`

Single source of truth for all post data. Nothing else touches the filesystem.

**Exports:**

```ts
const POSTS_PER_PAGE = 10

interface PostMeta {
  slug: string         // filename without .mdx — becomes the URL
  title: string
  date: string         // YYYY-MM-DD — used for sorting
  description: string  // used in cards and <meta>
  tags: string[]
  published: boolean   // false = draft, never served
  readingTime: string  // auto-calculated ("3 min read")
  authorSlug?: string  // raw slug from frontmatter e.g. "david-conteh"
  author?: Author      // resolved Author object from lib/authors.ts
}

interface Post extends PostMeta {
  content: string      // raw MDX string passed to MDXRemote
}

getAllPosts(): PostMeta[]                               // all published, newest first
getPostsPage(page: number): PostMeta[]                 // one page (POSTS_PER_PAGE items)
getTotalPages(): number
getPostCount(): number
getPost(slug: string): Post | null
getRelatedPosts(slug: string, tags: string[], count?: number): PostMeta[]
```

**`getRelatedPosts`** ranks by number of shared tags. Falls back to recent posts when there aren't enough tag matches. Never includes the current post.

---

## Authors — `lib/authors.ts`

Static registry. Each author is an object keyed by slug.

```ts
interface Author {
  slug: string
  name: string
  title: string
  bio: string
  image: string   // path relative to /public e.g. "/people/davidconteh.png"
  social: {
    twitter?: string   // full URL: "https://x.com/handle"
    github?: string
    linkedin?: string
    website?: string
  }
}
```

**To add an author:**
1. Add their entry to `AUTHORS` in `lib/authors.ts`
2. Use their slug as `author: their-slug` in MDX frontmatter

Authors are resolved at parse time in `lib/posts.ts` — no runtime lookup.

---

## Routing

| URL | File | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Page 1 of post list |
| `/page/:n` | `app/page/[page]/page.tsx` | Pages 2+ |
| `/:slug` | `app/[slug]/page.tsx` | Post detail, statically generated |
| `/:slug#section` | — | Deep link to heading anchor |
| `/tag/:tag` | `app/tag/[tag]/page.tsx` | Filtered list, statically generated |
| `/feed.xml` | `app/feed.xml/route.ts` | RSS 2.0 feed |
| `/sitemap.xml` | `app/sitemap.ts` | Auto-generated by Next.js |
| `/robots.txt` | `app/robots.ts` | Auto-generated by Next.js |

All post, page, and tag routes are **statically generated at build time**.

---

## Pagination

- **10 posts per page** (`POSTS_PER_PAGE` constant in `lib/posts.ts`)
- Page 1 → `/` (root)
- Page 2+ → `/page/2`, `/page/3` etc.
- `generateStaticParams` pre-renders all pages at build time
- Invalid pages return 404

---

## Search

Built in `SearchablePosts` — **currently off**. To enable:

```tsx
// app/page.tsx and app/page/[page]/page.tsx
<SearchablePosts posts={posts} allPosts={allPosts} searchEnabled={true} />
```

When active, search covers **all posts across all pages** (`allPosts` prop), not just the current page. Filters by title, description, tags, and author name.

---

## Heading Deep Links

`h2` and `h3` in every post are rendered via `components/mdx/Heading.tsx`. Each heading:
- Gets an `id` auto-generated from its text content (slugified)
- Shows a `#` anchor link on hover
- Has `scroll-mt-20` to offset the sticky header on jump

**Usage:** `log.10na.city/post-slug#section-heading`

No configuration needed — works automatically for all `## headings` in MDX.

---

## SEO

### Metadata

Root metadata in `app/layout.tsx`:
- `metadataBase: new URL('https://log.10na.city')` — required for absolute OG URLs
- Title template: `'%s — log.10na.city'`
- Full OpenGraph + Twitter card
- `manifest: '/manifest.json'` for PWA

Per-post metadata in `app/[slug]/page.tsx`:
- `openGraph.type: 'article'` with `publishedTime`, `authors`, `tags`
- `alternates.canonical`
- JSON-LD `BlogPosting` structured data

### OG Images

`app/[slug]/opengraph-image.tsx` generates 1200×630 PNG per post at build time.

### Sitemap

`app/sitemap.ts` → `/sitemap.xml`. Includes homepage + every published post.

### RSS

`app/feed.xml/route.ts` → `/feed.xml`. RSS 2.0, linked in `<head>`, shown in header.

---

## PWA

The app is installable as a native-feeling mobile app:
- `public/manifest.json` — name, icons, `display: standalone`, theme colour
- `appleWebApp` meta in `app/layout.tsx` — iOS home screen support
- `viewport.themeColor` — status bar colour on Android

App shell layout: header and footer are fixed anchors (`shrink-0` in a `flex flex-col h-full` body). Only `<main>` scrolls (`flex-1 overflow-y-auto`).

---

## Global MDX Components

Registered in `app/[slug]/page.tsx`:
```ts
const mdxComponents = {
  PostImage,
  CaptionImage,
  LayoutImage,
  h2: H2,   // anchor headings
  h3: H3,
}
```

Available in every `.mdx` file with no import. **To add a new component:**
1. Create `components/mdx/MyComponent.tsx`
2. Export from `components/mdx/index.ts`
3. Add to `mdxComponents` in `app/[slug]/page.tsx`

---

## Image Components

### `<PostImage src alt />`
Full-width image, no caption.

### `<CaptionImage src alt caption />`
Full-width image with required caption below.

### `<LayoutImage src alt layout? caption? src2? alt2? />`

| layout | Behaviour |
|---|---|
| `"full"` | Default. Full column width. |
| `"wide"` | Bleeds wider than the text column. |
| `"left"` | Float left, text wraps right. |
| `"right"` | Float right, text wraps left. |
| `"split"` | Two images side by side (needs `src2` + `alt2`). |

Float layouts need a clear div after the wrapping paragraph:
```mdx
<LayoutImage src="..." alt="..." layout="left" />
Paragraph that wraps...
<div style={{ clear: 'both' }} />
```

---

## Typography — `.prose-log`

Post body is wrapped in `<article className="prose-log">`. Defined in `app/globals.css`.

Base: `font-serif`, `1.125rem`, `line-height: 1.75`, color `#37322f`.

Styled elements: `p h2 h3 ul ol li strong a blockquote code pre hr`

---

## Related Posts

`getRelatedPosts(slug, tags, count = 3)` in `lib/posts.ts` returns up to 3 related posts, ranked by shared tag count. Falls back to recent posts when there aren't enough matches.

Rendered by `components/log/related-posts.tsx` — appears after the author card at the bottom of each post under "Continue reading".

---

## Deployment

### Vercel setup (feature/log branch)
1. Create a new Vercel project → import same GitHub repo
2. Set **Branch** to `feature/log`
3. Add custom domain: `log.10na.city`
4. Follow DNS instructions (CNAME to `cname.vercel-dns.com`)

### Publish workflow
```bash
git add content/posts/my-post.mdx
git commit -m "publish: my post title"
git push origin feature/log
```

New post is live in ~30 seconds.

---

## Demo & Reference Files

| File | Purpose |
|---|---|
| `content/posts/image-components-demo.mdx` | Visual reference for all image layouts. Set `published: true` to preview locally. |
| `content/posts/why-most-builders-quit-too-early.mdx` | Example full post |
| `content/posts/resources-for-first-time-founders.mdx` | Example resource post |
