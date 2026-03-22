# Publishing Guide — log.10na.city

Everything you need to write and publish posts on log.10na.city.

---

## How It Works

Posts are `.mdx` files in `content/posts/`. Push to GitHub → Vercel rebuilds → post goes live. No CMS, no login, no dashboard.

---

## Writing a Post

### 1. Create the file

```
content/posts/my-post-slug.mdx  →  log.10na.city/my-post-slug
```

Filename rules: lowercase, hyphens only, no spaces.

### 2. Add frontmatter

```yaml
---
title: "Why Focus Beats Hustle Every Time"
date: "2026-03-22"
description: "One sentence for the card and SEO. Keep under 160 characters."
tags: ["mindset", "building"]
published: true
author: "david-conteh"
---
```

| Field | Required | Notes |
|---|---|---|
| `title` | Yes | Shown on post and browser tab |
| `date` | Yes | `YYYY-MM-DD` — used for sorting |
| `description` | Yes | Shown on list cards and in `<meta>` |
| `tags` | No | Array. Clickable pills linking to `/tag/tag-name` |
| `published` | Yes | `true` = live, `false` = draft |
| `author` | No | Author slug from `lib/authors.ts`. Shows author card below post. |

### 3. Write the content

Standard Markdown — no heading needed at the top (the title is already displayed above the article):

```markdown
Opening paragraph here.

## Section Heading

Subheadings automatically get `#` anchor links so readers can share
direct links to any section: log.10na.city/post-slug#section-heading

- Bullet point
- Another point

> Blockquote for pull quotes.
```

### 4. Publish

```bash
git add content/posts/my-post.mdx
git commit -m "publish: why focus beats hustle"
git push
```

Live in ~30 seconds.

---

## Drafts

Set `published: false`. The post won't appear in the list or be accessible by URL. Change to `true` and push when ready.

---

## Heading Deep Links

Every `##` and `###` heading in a post automatically becomes a shareable anchor:

```
log.10na.city/post-slug#why-most-builders-quit
```

The `#` link appears on hover. The URL works on WhatsApp, Twitter, email — clicking it opens the page and scrolls to that heading.

No setup needed. It works for all headings automatically.

---

## Images

Place images in `public/` or a subfolder like `public/images/`. Reference by path from root:

```
public/images/my-photo.jpg  →  src="/images/my-photo.jpg"
```

Three image components are available in every post — no import needed.

---

### `<PostImage>` — Basic full-width image

```mdx
<PostImage src="/images/my-photo.jpg" alt="Describe the image" />
```

---

### `<CaptionImage>` — Image with caption

```mdx
<CaptionImage
  src="/images/my-photo.jpg"
  alt="Describe the image"
  caption="Caption displayed below the image."
/>
```

---

### `<LayoutImage>` — Image with layout control

```mdx
<LayoutImage
  src="/images/my-photo.jpg"
  alt="Describe the image"
  layout="wide"
  caption="Optional caption"
/>
```

| `layout` | Description |
|---|---|
| `"full"` | Default. Full column width. |
| `"wide"` | Wider than the text column — good for panoramic shots. |
| `"left"` | Floats left, text wraps right. |
| `"right"` | Floats right, text wraps left. |
| `"split"` | Two images side by side — requires `src2` and `alt2`. |

**Split example:**
```mdx
<LayoutImage
  src="/images/photo-a.jpg" alt="First image"
  src2="/images/photo-b.jpg" alt2="Second image"
  layout="split"
/>
```

**Float layout note:** add a clear div after the paragraph that wraps the image:
```mdx
<LayoutImage src="/images/photo.jpg" alt="..." layout="left" />

Paragraph that wraps around the image on desktop...

<div style={{ clear: 'both' }} />
```

**Preview all layouts:** set `published: true` on `content/posts/image-components-demo.mdx` and run locally.

---

## Authors

Authors are registered in `lib/authors.ts`. To attribute a post, set `author: your-slug` in the frontmatter. The author's avatar, bio, and social links appear at the bottom of the post automatically.

### Adding a new author

1. Add a profile image to `public/people/your-name.png`
2. Add an entry to `lib/authors.ts`:

```ts
'your-slug': {
  slug: 'your-slug',
  name: 'Your Name',
  title: 'Your role',
  bio: 'One or two sentences about you.',
  image: '/people/your-name.png',
  social: {
    twitter: 'https://x.com/yourhandle',
    github: 'https://github.com/yourhandle',
  },
},
```

3. Use `author: "your-slug"` in any post frontmatter.

---

## Related Posts

At the bottom of each post, up to 3 related posts are shown under "Continue reading". Posts are ranked by shared tags — the more tags in common, the higher they appear. If there aren't enough tag matches, recent posts fill the gap.

No setup needed. It works automatically based on the `tags` field in frontmatter.

---

## Adding Custom React Components

Any React component can be used globally in all posts.

### Step 1 — Build it

```tsx
// components/mdx/Callout.tsx
export function Callout({ children, type = 'info' }: {
  children: React.ReactNode
  type?: 'info' | 'warning'
}) {
  return (
    <div className={`border-l-2 pl-4 my-6 ${
      type === 'warning' ? 'border-red-400' : 'border-[#37322f]/30'
    }`}>
      {children}
    </div>
  )
}
```

### Step 2 — Export it

```ts
// components/mdx/index.ts
export { Callout } from './Callout'
```

### Step 3 — Register it

```tsx
// app/[slug]/page.tsx
import { ..., Callout } from '@/components/mdx'

const mdxComponents = { ..., Callout }
```

### Step 4 — Use it in any post

```mdx
<Callout type="warning">
  This is important. Don't skip this step.
</Callout>
```

No import needed in the post file.

---

## File Reference

| File | What it does |
|---|---|
| `lib/posts.ts` | Reads all `.mdx` files, parses frontmatter, handles pagination and related posts |
| `lib/authors.ts` | Author registry — add new authors here |
| `app/page.tsx` | Homepage — page 1 of the post list |
| `app/page/[page]/page.tsx` | Paginated post list (pages 2+) |
| `app/[slug]/page.tsx` | Post detail page — renders MDX, shows author + related posts |
| `components/mdx/index.ts` | Register new MDX components here |
| `app/globals.css` | `.prose-log` styles control how body text renders |
| `public/manifest.json` | PWA manifest — controls how the app looks when installed |
