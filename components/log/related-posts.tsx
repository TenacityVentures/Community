import Link from 'next/link'
import type { PostMeta } from '@/lib/posts'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

export function RelatedPosts({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) return null

  return (
    <section className="mt-16 pt-10 border-t border-[#37322f]/10">
      <p
        className="text-xs text-[#37322f]/40 uppercase tracking-widest mb-8"
        style={{ fontFamily: 'var(--font-serif), serif' }}
      >
        Continue reading
      </p>

      <ul className="space-y-7">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/${post.slug}`} className="group block">
              <div className="flex items-baseline gap-3 mb-1">
                <time className="text-xs text-[#37322f]/35 shrink-0">
                  {formatDate(post.date)}
                </time>
                <span className="text-xs text-[#37322f]/25">{post.readingTime}</span>
              </div>
              <h3
                className="text-lg text-[#37322f] group-hover:opacity-60 transition-opacity leading-snug mb-1"
                style={{ fontFamily: 'var(--font-serif), serif' }}
              >
                {post.title}
              </h3>
              <p className="text-sm text-[#37322f]/55 leading-relaxed line-clamp-2">
                {post.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
