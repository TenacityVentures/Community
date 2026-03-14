import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function HomePage() {
  const posts = getAllPosts()

  return (
    <div className="max-w-2xl mx-auto px-6 py-16" style={{ fontFamily: 'var(--font-serif), serif' }}>
      <div className="mb-14">
        <h1 className="text-4xl text-[#37322f] mb-3">The Log</h1>
        <p className="text-[#37322f]/60 text-lg">Essays, resources, and bold tenacity content.</p>
      </div>

      {posts.length === 0 ? (
        <p className="text-[#37322f]/40">Nothing published yet.</p>
      ) : (
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
              {post.tags.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
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
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
