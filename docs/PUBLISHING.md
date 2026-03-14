# Publishing Guide — log.10na.city

This document covers everything you need to know to publish and maintain content on log.10na.city.

---

## How It Works

Posts are `.mdx` files stored in `content/posts/`. When you push to GitHub, Vercel rebuilds the site and your post goes live. No CMS, no login, no dashboard.

```
content/
  posts/
    my-post-slug.mdx      ← one file = one post
    another-post.mdx
```

---

## Publishing a Post

### 1. Create the file

Create a new file in `content/posts/`. The filename becomes the URL slug.

```
content/posts/why-focus-beats-hustle.mdx
→ log.10na.city/why-focus-beats-hustle
```

Use lowercase, hyphens only, no spaces.

### 2. Add frontmatter

Every post starts with a YAML block between `---` delimiters:

```yaml
---
title: "Why Focus Beats Hustle Every Time"
date: "2026-03-14"
description: "A short sentence for the post card and SEO. Keep it under 160 characters."
tags: ["mindset", "building"]
published: true
---
```

| Field | Required | Notes |
|---|---|---|
| `title` | Yes | Shown on the post and in the browser tab |
| `date` | Yes | Format: `YYYY-MM-DD`. Used for sorting. |
| `description` | Yes | Shown on the post list card and in `<meta>` tags |
| `tags` | No | Array of strings. Shown as pills on cards and posts. |
| `published` | Yes | `true` to make live, `false` to keep as draft |

### 3. Write the content

Below the frontmatter, write in standard Markdown:

```markdown
Opening paragraph here. No heading needed — the title is already shown above.

## Section Heading

More content...

- Bullet point
- Another point

> A blockquote for pull quotes or emphasis.
```

### 4. Publish

```bash
git add content/posts/my-post.mdx
git commit -m "publish: why focus beats hustle"
git push
```

Vercel deploys in ~30 seconds. Your post is live.

---

## Drafts

Set `published: false` in the frontmatter. The post will not appear on the list or be accessible by URL. Change to `true` and push when ready.

---

## Images

Place image files in the `public/` directory (or a subfolder like `public/images/`). Reference them by path from root.

```
public/images/my-photo.jpg
→ src="/images/my-photo.jpg"
```

### Available image components

Three components are available in every post — no import needed.

---

#### `<PostImage>` — Basic full-width image

```mdx
<PostImage src="/images/my-photo.jpg" alt="Describe the image" />
```

| Prop | Required | Description |
|---|---|---|
| `src` | Yes | Path from `public/` |
| `alt` | Yes | Alt text for accessibility |

---

#### `<CaptionImage>` — Image with caption

```mdx
<CaptionImage
  src="/images/my-photo.jpg"
  alt="Describe the image"
  caption="The caption displayed below the image."
/>
```

| Prop | Required | Description |
|---|---|---|
| `src` | Yes | Path from `public/` |
| `alt` | Yes | Alt text |
| `caption` | Yes | Caption text shown below |

---

#### `<LayoutImage>` — Image with layout control

The most flexible option. Supports five layouts.

```mdx
<LayoutImage
  src="/images/my-photo.jpg"
  alt="Describe the image"
  layout="wide"
  caption="Optional caption"
/>
```

| Prop | Required | Default | Description |
|---|---|---|---|
| `src` | Yes | — | Path from `public/` |
| `alt` | Yes | — | Alt text |
| `layout` | No | `"full"` | See layout options below |
| `caption` | No | — | Optional caption |
| `src2` | No | — | Second image (split layout only) |
| `alt2` | No | — | Alt for second image (split layout only) |

**Layout options:**

| Value | Description |
|---|---|
| `"full"` | Default. Full column width. |
| `"wide"` | Breaks out of column — wider than the text. Good for panoramic shots. |
| `"left"` | Floats left, text wraps right. |
| `"right"` | Floats right, text wraps left. |
| `"split"` | Two images side by side. Requires `src2` and `alt2`. |

**Float layout note:** When using `left` or `right`, add a clear div after the paragraph that wraps the image:

```mdx
<LayoutImage src="/images/photo.jpg" alt="..." layout="left" />

Paragraph that wraps around the image on desktop...

<div style={{ clear: 'both' }} />
```

**Demo post:** `content/posts/image-components-demo.mdx` (set `published: true` to preview all layouts locally).

---

## Adding Custom React Components to Posts

Any React component can be made available globally in all posts.

### Step 1 — Build the component

Create it in `components/mdx/`:

```tsx
// components/mdx/Callout.tsx
interface CalloutProps {
  children: React.ReactNode
  type?: 'info' | 'warning'
}

export function Callout({ children, type = 'info' }: CalloutProps) {
  return (
    <div className={`border-l-2 pl-4 my-6 ${type === 'warning' ? 'border-red-400' : 'border-[#37322f]/30'}`}>
      {children}
    </div>
  )
}
```

### Step 2 — Export it

Add to `components/mdx/index.ts`:

```ts
export { Callout } from './Callout'
```

### Step 3 — Register it

Add to the `mdxComponents` object in `app/log/[slug]/page.tsx`:

```tsx
import { PostImage, CaptionImage, LayoutImage, Callout } from '@/components/mdx'

const mdxComponents = {
  PostImage,
  CaptionImage,
  LayoutImage,
  Callout,           // ← add here
}
```

### Step 4 — Use it in any post

```mdx
<Callout type="warning">
  This is important. Don't skip this step.
</Callout>
```

No import needed in the post file — it's globally registered.

---

## File Structure Reference

```
content/
  posts/                          ← your writing lives here
    post-slug.mdx

components/
  mdx/
    PostImage.tsx                 ← basic image
    CaptionImage.tsx              ← image + caption
    LayoutImage.tsx               ← image with layout control
    index.ts                      ← barrel export

app/
  log/
    layout.tsx                    ← shared header/nav for log
    page.tsx                      ← post list at /log
    [slug]/
      page.tsx                    ← post detail + MDX renderer

lib/
  posts.ts                        ← reads/parses MDX files

PUBLISHING.md                     ← this file
```

---

## Key Files

| File | What it does |
|---|---|
| `lib/posts.ts` | Reads all `.mdx` files, parses frontmatter, filters published, sorts by date |
| `app/log/page.tsx` | Post list page — shows all published posts |
| `app/log/[slug]/page.tsx` | Post detail page — renders MDX, passes components |
| `components/mdx/index.ts` | Register new MDX components here |
| `app/globals.css` | `.prose-log` styles control how body text renders in posts |

---

## Subdomain Setup (Vercel)

To route `log.10na.city` to this section:

1. Vercel dashboard → Project → Settings → Domains
2. Add `log.10na.city`
3. Follow the DNS instructions (add CNAME record)

The rewrite rule in `next.config.mjs` handles routing the subdomain to `/log` automatically.
