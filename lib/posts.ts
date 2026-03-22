import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import { getAuthor, type Author } from './authors'

const POSTS_DIR = path.join(process.cwd(), 'content/posts')

export interface PostMeta {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
  published: boolean
  readingTime: string
  authorSlug?: string
  author?: Author
}

export interface Post extends PostMeta {
  content: string
}

function getPostFiles(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return []
  return fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.mdx'))
}

export function getAllPosts(): PostMeta[] {
  return getPostFiles()
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, '')
      const raw = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf-8')
      const { data, content } = matter(raw)
      const authorSlug: string | undefined = data.author
      return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? '',
        description: data.description ?? '',
        tags: data.tags ?? [],
        published: data.published ?? false,
        readingTime: readingTime(content).text,
        authorSlug,
        author: authorSlug ? (getAuthor(authorSlug) ?? undefined) : undefined,
      }
    })
    .filter((p) => p.published)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export const POSTS_PER_PAGE = 10

export function getPostCount(): number {
  return getAllPosts().length
}

export function getTotalPages(): number {
  return Math.ceil(getPostCount() / POSTS_PER_PAGE)
}

/** Returns one page of posts (1-indexed). */
export function getPostsPage(page: number): PostMeta[] {
  const all = getAllPosts()
  const start = (page - 1) * POSTS_PER_PAGE
  return all.slice(start, start + POSTS_PER_PAGE)
}

/**
 * Returns up to `count` posts related to the given slug by shared tags.
 * Falls back to recent posts if there aren't enough tag matches.
 */
export function getRelatedPosts(currentSlug: string, tags: string[], count = 3): PostMeta[] {
  const all = getAllPosts().filter((p) => p.slug !== currentSlug)

  if (tags.length === 0) return all.slice(0, count)

  const scored = all.map((p) => ({
    post: p,
    score: p.tags.filter((t) => tags.includes(t)).length,
  }))

  const matches  = scored.filter(({ score }) => score > 0).sort((a, b) => b.score - a.score)
  const fallback = scored.filter(({ score }) => score === 0)

  return [...matches, ...fallback]
    .slice(0, count)
    .map(({ post }) => post)
}

export function getPost(slug: string): Post | null {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  const authorSlug: string | undefined = data.author
  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? '',
    description: data.description ?? '',
    tags: data.tags ?? [],
    published: data.published ?? false,
    readingTime: readingTime(content).text,
    content,
    authorSlug,
    author: authorSlug ? (getAuthor(authorSlug) ?? undefined) : undefined,
  }
}
