"use client"

import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { MessageCircle, Eye } from "lucide-react"
import type { PostWithAuthor, PostCategory } from "@/lib/supabase/types"

const categoryStyles: Record<PostCategory, { bg: string; text: string; darkBg: string; darkText: string; icon: string }> = {
  building: { bg: "bg-amber-50", text: "text-amber-700", darkBg: "dark:bg-amber-900/30", darkText: "dark:text-amber-300", icon: "🛠️" },
  ideas: { bg: "bg-yellow-50", text: "text-yellow-700", darkBg: "dark:bg-yellow-900/30", darkText: "dark:text-yellow-300", icon: "💡" },
  stories: { bg: "bg-blue-50", text: "text-blue-700", darkBg: "dark:bg-blue-900/30", darkText: "dark:text-blue-300", icon: "📖" },
  opportunities: { bg: "bg-green-50", text: "text-green-700", darkBg: "dark:bg-green-900/30", darkText: "dark:text-green-300", icon: "🤝" },
  challenges: { bg: "bg-purple-50", text: "text-purple-700", darkBg: "dark:bg-purple-900/30", darkText: "dark:text-purple-300", icon: "🎯" },
}

interface PostCardProps {
  post: PostWithAuthor
}

export function PostCard({ post }: PostCardProps) {
  const category = categoryStyles[post.category]
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true })

  return (
    <Link href={`/arena/post/${post.slug}`}>
      <article className="group bg-[var(--arena-card)] rounded-xl border border-[var(--arena-border)] p-5 hover:border-[var(--arena-text)]/20 hover:shadow-md transition-all duration-300">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            {/* Author Avatar */}
            <div className="w-10 h-10 rounded-full bg-[var(--arena-text)] text-[var(--arena-bg)] flex items-center justify-center text-sm font-medium overflow-hidden flex-shrink-0">
              {post.author.avatar_url ? (
                <img
                  src={post.author.avatar_url}
                  alt={post.author.full_name || post.author.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                (post.author.full_name?.[0] || post.author.username[0]).toUpperCase()
              )}
            </div>

            {/* Author Info */}
            <div>
              <p className="font-medium text-[var(--arena-text)] text-sm">
                {post.author.full_name || post.author.username}
              </p>
              <p className="text-xs text-[var(--arena-text-muted)]">
                @{post.author.username} · {timeAgo}
              </p>
            </div>
          </div>

          {/* Category Badge */}
          <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-medium ${category.bg} ${category.text} ${category.darkBg} ${category.darkText}`}>
            {category.icon} {post.category}
          </span>
        </div>

        {/* Content */}
        <h2 className="font-instrument-serif text-xl text-[var(--arena-text)] mb-2 group-hover:opacity-80 transition-colors">
          {post.title}
        </h2>

        {post.excerpt && (
          <p className="text-[var(--arena-text-muted)] text-sm line-clamp-2 mb-4">
            {post.excerpt}
          </p>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-[var(--arena-bg)] text-[var(--arena-text-muted)] text-xs rounded-md"
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-[var(--arena-text-muted)]">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer Stats */}
        <div className="flex items-center gap-4 text-sm text-[var(--arena-text-muted)]">
          <span className="flex items-center gap-1.5">
            <MessageCircle className="w-4 h-4" />
            {post.comment_count}
          </span>
          <span className="flex items-center gap-1.5">
            <Eye className="w-4 h-4" />
            {post.view_count}
          </span>
        </div>

        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-full h-full bg-gradient-to-bl from-[var(--arena-text)]/5 to-transparent rounded-tr-xl" />
        </div>
      </article>
    </Link>
  )
}

// Empty State Component
export function EmptyPostState({ category }: { category?: string }) {
  return (
    <div className="text-center py-16 px-4">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--arena-bg)] flex items-center justify-center">
        <span className="text-3xl">💪</span>
      </div>
      <h3 className="font-instrument-serif text-2xl text-[var(--arena-text)] mb-2">
        {category ? `No ${category} posts yet` : "The Arena awaits"}
      </h3>
      <p className="text-[var(--arena-text-muted)] mb-6 max-w-md mx-auto">
        Be the first to share your thoughts, ideas, and ventures with the community.
        Every fearless journey starts with a single step.
      </p>
      <Link
        href="/arena/new"
        className="inline-flex items-center gap-2 bg-[var(--arena-text)] text-[var(--arena-bg)] px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-colors"
      >
        Start a Discussion
      </Link>
    </div>
  )
}

// Loading Skeleton
export function PostCardSkeleton() {
  return (
    <div className="bg-[var(--arena-card)] rounded-xl border border-[var(--arena-border)] p-5 animate-pulse">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--arena-border)]" />
          <div>
            <div className="h-4 w-24 bg-[var(--arena-border)] rounded mb-1" />
            <div className="h-3 w-32 bg-[var(--arena-border)] rounded" />
          </div>
        </div>
        <div className="h-6 w-20 bg-[var(--arena-border)] rounded-full" />
      </div>
      <div className="h-6 w-3/4 bg-[var(--arena-border)] rounded mb-2" />
      <div className="h-4 w-full bg-[var(--arena-border)] rounded mb-1" />
      <div className="h-4 w-2/3 bg-[var(--arena-border)] rounded mb-4" />
      <div className="flex gap-4">
        <div className="h-4 w-12 bg-[var(--arena-border)] rounded" />
        <div className="h-4 w-12 bg-[var(--arena-border)] rounded" />
      </div>
    </div>
  )
}
