"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/supabase/auth-context"
import { ArenaHeader } from "@/components/arena/arena-header"
import { PostCard, PostCardSkeleton } from "@/components/arena/post-card"
import { motion } from "framer-motion"
import { Bookmark, ArrowLeft, Loader2 } from "lucide-react"
import type { PostWithAuthor } from "@/lib/supabase/types"

const POSTS_PER_PAGE = 10

export default function BookmarksPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const supabase = createClient()

  const [bookmarks, setBookmarks] = useState<PostWithAuthor[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/arena/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return

    async function fetchBookmarks() {
      setLoading(true)

      const from = 0
      const to = POSTS_PER_PAGE - 1

      const { data, count, error } = await (supabase.from("bookmarks") as any)
        .select(`
          id,
          created_at,
          post:posts!bookmarks_post_id_fkey(
            *,
            author:profiles!posts_author_id_fkey(*)
          )
        `, { count: 'exact' })
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .range(from, to)

      if (!error && data) {
        const posts = data
          .map((b: any) => b.post)
          .filter((p: any) => p !== null) as PostWithAuthor[]
        setBookmarks(posts)
        setTotal(count || 0)
        setHasMore((count || 0) > POSTS_PER_PAGE)
      }

      setLoading(false)
    }

    fetchBookmarks()
  }, [user, supabase])

  const loadMore = async () => {
    if (!user) return
    setLoadingMore(true)
    const nextPage = page + 1
    const from = (nextPage - 1) * POSTS_PER_PAGE
    const to = from + POSTS_PER_PAGE - 1

    const { data } = await (supabase.from("bookmarks") as any)
      .select(`
        id,
        created_at,
        post:posts!bookmarks_post_id_fkey(
          *,
          author:profiles!posts_author_id_fkey(*)
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(from, to)

    if (data) {
      const posts = data
        .map((b: any) => b.post)
        .filter((p: any) => p !== null) as PostWithAuthor[]
      setBookmarks(prev => [...prev, ...posts])
      setPage(nextPage)
      setHasMore(total > nextPage * POSTS_PER_PAGE)
    }

    setLoadingMore(false)
  }

  const handleRemoveBookmark = async (postId: string) => {
    if (!user) return
    await (supabase.from("bookmarks") as any)
      .delete()
      .eq("user_id", user.id)
      .eq("post_id", postId)

    setBookmarks(prev => prev.filter(p => p.id !== postId))
    setTotal(prev => prev - 1)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--arena-bg)]">
        <ArenaHeader />
        <main className="max-w-[800px] mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-[var(--arena-border)] rounded" />
            <div className="h-4 w-64 bg-[var(--arena-border)] rounded" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--arena-bg)]">
      <ArenaHeader />

      <main className="max-w-[800px] mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/arena"
            className="inline-flex items-center gap-2 text-[var(--arena-text-faint)] hover:text-[var(--arena-text)] transition-colors mb-6 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[var(--arena-text)]/10 flex items-center justify-center">
                <Bookmark className="w-5 h-5 text-[var(--arena-text)]" />
              </div>
              <h1 className="font-instrument-serif text-3xl text-[var(--arena-text)]">Bookmarks</h1>
            </div>
            <p className="text-sm text-[var(--arena-text-faint)] ml-[52px]">
              {total > 0 ? `${total} saved ${total === 1 ? 'post' : 'posts'}` : 'Save posts to read later'}
            </p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <PostCardSkeleton key={i} />
              ))}
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--arena-text)]/5 flex items-center justify-center">
                <Bookmark className="w-8 h-8 text-[var(--arena-text-faint)]" />
              </div>
              <h3 className="text-lg font-medium text-[var(--arena-text)] mb-2">No bookmarks yet</h3>
              <p className="text-sm text-[var(--arena-text-faint)] mb-6 max-w-xs mx-auto">
                When you bookmark posts, they'll appear here for easy access.
              </p>
              <Link
                href="/arena"
                className="inline-flex items-center gap-2 bg-[var(--arena-text)] text-[var(--arena-bg)] px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-colors"
              >
                Explore The Arena
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {bookmarks.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
                    className="relative group"
                  >
                    <PostCard post={post} />
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleRemoveBookmark(post.id)
                      }}
                      className="absolute top-4 right-4 p-2 bg-[var(--arena-card)]/90 backdrop-blur rounded-lg text-[var(--arena-text)] opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-[var(--arena-card)]"
                      title="Remove bookmark"
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </motion.div>
                ))}
              </div>

              {hasMore && (
                <div className="mt-8 text-center">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm text-[var(--arena-text-muted)] hover:text-[var(--arena-text)] transition-colors disabled:opacity-50"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Load more'
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </motion.div>
      </main>
    </div>
  )
}
