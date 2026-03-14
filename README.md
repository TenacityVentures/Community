# log.10na.city

A standalone blog for [10na.city](https://10na.city) — essays, resources, and bold tenacity content.

Live at **[log.10na.city](https://log.10na.city)**

---

## Stack

- **Framework:** Next.js 14 (App Router)
- **Content:** MDX files in `content/posts/`
- **Styling:** Tailwind CSS
- **Deployment:** Vercel (`feature/log` branch → `log.10na.city`)

## Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

## Publishing a Post

Create a `.mdx` file in `content/posts/`:

```yaml
---
title: "Your Post Title"
date: "2026-03-14"
description: "Short description for cards and SEO."
tags: ["mindset", "building"]
published: true
---

Your content in markdown here.
```

Push to `feature/log` → Vercel deploys in ~30 seconds.

## Docs

- [PUBLISHING.md](./PUBLISHING.md) — full authoring guide (frontmatter, images, MDX components)
- [docs/log-feature.md](./docs/log-feature.md) — technical developer reference

## Branch

This app lives on the `feature/log` branch, deployed independently from the main [10na.city](https://10na.city) site on `master`.
