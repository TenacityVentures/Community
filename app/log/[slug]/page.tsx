import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllPosts, getPost } from '@/lib/posts'
import { PostImage, CaptionImage, LayoutImage } from '@/components/mdx'

const mdxComponents = {
  PostImage,
  CaptionImage,
  LayoutImage,
}

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost(params.slug)
  if (!post) return {}
  return {
    title: `${post.title} — log.10na.city`,
    description: post.description,
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function PostPage({ params }: Props) {
  const post = getPost(params.slug)
  if (!post || !post.published) notFound()

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      {/* Back link */}
      <Link
        href="/log"
        className="text-sm text-[#37322f]/40 hover:text-[#37322f] transition-colors mb-10 inline-block"
      >
        ← all posts
      </Link>

      {/* Header */}
      <header className="mb-12">
        <h1 className="text-4xl text-[#37322f] mb-4 leading-tight">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-[#37322f]/40">
          <time>{formatDate(post.date)}</time>
          <span>·</span>
          <span>{post.readingTime}</span>
        </div>
        {post.tags.length > 0 && (
          <div className="flex gap-2 mt-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-[#37322f]/40 border border-[#37322f]/20 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <article className="prose-log">
        <MDXRemote source={post.content} components={mdxComponents} />
      </article>
    </div>
  )
}
