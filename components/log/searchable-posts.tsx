'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { PostMeta } from '@/lib/posts'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// ── Search input ─────────────────────────────────────────────────────────────
function SearchInput({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="mb-10 relative">
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search posts, tags, authors…"
        className="
          w-full bg-transparent border-b border-[#37322f]/20 pb-2
          text-[#37322f] placeholder:text-[#37322f]/30
          text-base outline-none
          focus:border-[#37322f]/50
          transition-colors duration-200
          [&::-webkit-search-cancel-button]:hidden
        "
        style={{ fontFamily: 'var(--font-serif), serif' }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-0 bottom-2 text-[#37322f]/30 hover:text-[#37322f] transition-colors text-sm"
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  )
}

// ── Post list ────────────────────────────────────────────────────────────────
function PostList({ posts, query }: { posts: PostMeta[]; query: string }) {
  if (posts.length === 0) {
    return (
      <p className="text-[#37322f]/40 text-sm pt-2">
        {query
          ? <>No posts match &ldquo;{query}&rdquo;.</>
          : 'Nothing published yet.'}
      </p>
    )
  }

  return (
    <ul className="space-y-10">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link href={`/${post.slug}`} className="group block">
            <div className="flex items-baseline gap-3 mb-1 flex-wrap">
              <time className="text-sm text-[#37322f]/40 shrink-0">
                {formatDate(post.date)}
              </time>
              <span className="text-xs text-[#37322f]/30">{post.readingTime}</span>
              {/* {post.author && (
                <span className="text-xs text-[#37322f]/40 ml-auto shrink-0">
                  {post.author.name}
                </span>
              )} */}
            </div>
            <h2 className="text-xl text-[#37322f] group-hover:opacity-70 transition-opacity mb-1">
              {post.title}
            </h2>
            <p className="text-[#37322f]/60 text-base leading-relaxed">
              {post.description}
            </p>
            {post.tags.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
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
          </Link>
        </li>
      ))}
    </ul>
  )
}

// ── Main export ──────────────────────────────────────────────────────────────
export function SearchablePosts({
  posts,
  allPosts,
  searchEnabled = false,
}: {
  /** Posts for the current page (used when not searching) */
  posts: PostMeta[]
  /** All posts across all pages — used when search is active. Defaults to posts. */
  allPosts?: PostMeta[]
  /** Set to true to show the search bar */
  searchEnabled?: boolean
}) {
  const [query, setQuery] = useState('')
  const corpus = allPosts ?? posts

  const filtered = useMemo(() => {
    if (!query.trim()) return posts
    const q = query.toLowerCase()
    return corpus.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.author?.name.toLowerCase().includes(q)
    )
  }, [corpus, posts, query])

  return (
    <div>
      {searchEnabled && (
        <SearchInput value={query} onChange={setQuery} />
      )}
      <PostList posts={filtered} query={query} />
    </div>
  )
}
