import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllPosts, getPost, getRelatedPosts } from '@/lib/posts'
import { PostImage, CaptionImage, LayoutImage, H2, H3 } from '@/components/mdx'
import { AuthorCard } from '@/components/log/author-card'
import { RelatedPosts } from '@/components/log/related-posts'

const mdxComponents = {
  PostImage,
  CaptionImage,
  LayoutImage,
  // Heading overrides — adds anchor `#` links + scroll-offset for sticky header.
  // Deep links work as: log.10na.city/post-slug#section-heading
  h2: H2,
  h3: H3,
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
  const authorName = post.author?.name ?? 'Tenacity'
  return {
    title: post.title,
    description: post.description,
    authors: [{ name: authorName }],
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url: `https://log.10na.city/${post.slug}`,
      siteName: 'log.10na.city',
      publishedTime: post.date,
      authors: [authorName],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
    alternates: {
      canonical: `https://log.10na.city/${post.slug}`,
    },
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

function PostJsonLd({ post }: { post: NonNullable<ReturnType<typeof getPost>> }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: post.author
      ? { '@type': 'Person', name: post.author.name }
      : { '@type': 'Organization', name: 'Tenacity' },
    publisher: {
      '@type': 'Organization',
      name: 'log.10na.city',
      url: 'https://log.10na.city',
    },
    url: `https://log.10na.city/${post.slug}`,
    keywords: post.tags.join(', '),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export default function PostPage({ params }: Props) {
  const post = getPost(params.slug)
  if (!post || !post.published) notFound()

  const related = getRelatedPosts(post.slug, post.tags)

  return (
    <>
      <PostJsonLd post={post} />

      <div
        className="max-w-2xl mx-auto px-6 py-16"
        style={{ fontFamily: 'var(--font-serif), serif' }}
      >
        {/* Back */}
        <Link
          href="/"
          className="text-sm text-[#37322f]/40 hover:text-[#37322f] transition-colors mb-10 inline-block"
        >
          ← all posts
        </Link>

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl text-[#37322f] mb-4 leading-tight">{post.title}</h1>

          {/* Byline */}
          <div className="flex items-center gap-3 text-sm text-[#37322f]/40 flex-wrap">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime}</span>
            {post.author && (
              <>
                <span aria-hidden="true">·</span>
                <span>{post.author.name}</span>
              </>
            )}
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex gap-2 mt-4 flex-wrap">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tag/${tag}`}
                  className="text-xs text-[#37322f]/40 border border-[#37322f]/20 px-2 py-0.5 rounded-full hover:border-[#37322f]/50 hover:text-[#37322f]/70 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </header>

        {/* Full post content — server-rendered MDX */}
        <article className="prose-log">
          <MDXRemote source={post.content} components={mdxComponents} />
        </article>

        {/* Author card */}
        {post.author && <AuthorCard author={post.author} />}

        {/* Related posts */}
        <RelatedPosts posts={related} />
      </div>
    </>
  )
}
