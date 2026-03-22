export interface Author {
  slug: string
  name: string
  title: string
  bio: string
  image: string
  social: {
    twitter?: string  // full URL e.g. "https://x.com/handle"
    github?: string   // full URL
    linkedin?: string // full URL
    website?: string  // full URL
  }
}

// ── Author registry ─────────────────────────────────────────────────────────
// Add new authors here. Use the slug as the key and set `author: <slug>`
// in the MDX frontmatter.
export const AUTHORS: Record<string, Author> = {
  'david-conteh': {
    slug: 'david-conteh',
    name: 'David Conteh',
    title: 'Founder, Tenacity',
    bio: 'Building in public. Obsessed with community, products, and the builders who refuse to wait.',
    image: '/people/davidconteh.png',
    social: {
      twitter: 'https://x.com/davidpaulconteh',
      github: 'https://github.com/davidddeveloper',
    },
  },
}

export function getAuthor(slug: string): Author | null {
  return AUTHORS[slug] ?? null
}
