import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/posts'

interface Props {
  params: { tag: string }
}

function getAllTags(): string[] {
  const posts = getAllPosts()
  return [...new Set(posts.flatMap((p) => p.tags))]
}

export async function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `#${params.tag}`,
    description: `All posts tagged "${params.tag}" on log.10na.city`,
    alternates: { canonical: `https://log.10na.city/tag/${params.tag}` },
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function TagPage({ params }: Props) {
  const allPosts = getAllPosts()
  const posts = allPosts.filter((p) => p.tags.includes(params.tag))

  if (posts.length === 0) notFound()

  return (
    <div className="max-w-2xl mx-auto px-6 py-16" style={{ fontFamily: 'var(--font-serif), serif' }}>
      <div className="mb-14">
        <Link href="/" className="text-sm text-[#37322f]/40 hover:text-[#37322f] transition-colors mb-6 inline-block">
          ← all posts
        </Link>
        <h1 className="text-4xl text-[#37322f] mb-3">#{params.tag}</h1>
        <p className="text-[#37322f]/60">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'}
        </p>
      </div>

      <ul className="space-y-10">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/${post.slug}`} className="group block">
              <div className="flex items-baseline gap-4 mb-1">
                <time className="text-sm text-[#37322f]/40 shrink-0">{formatDate(post.date)}</time>
                <span className="text-xs text-[#37322f]/30">{post.readingTime}</span>
              </div>
              <h2 className="text-xl text-[#37322f] group-hover:opacity-70 transition-opacity mb-1">
                {post.title}
              </h2>
              <p className="text-[#37322f]/60 text-base leading-relaxed">{post.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
