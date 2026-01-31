"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { PostCard, PostCardSkeleton, EmptyPostState } from "@/components/arena/post-card"
import { motion } from "framer-motion"
import { ChevronRight, Loader2, Zap, Hand } from "lucide-react"
import type { PostWithAuthor } from "@/lib/supabase/types"
import Link from "next/link"

const POSTS_PER_PAGE = 10
const INFINITE_SCROLL_KEY = "arena_infinite_scroll"

const categories = [
  { slug: "all", label: "All Posts", icon: "✨" },
  { slug: "building", label: "Building", icon: "🛠️" },
  { slug: "ideas", label: "Ideas", icon: "💡" },
  { slug: "stories", label: "Stories", icon: "📖" },
  { slug: "opportunities", label: "Opportunities", icon: "🤝" },
  { slug: "challenges", label: "Challenges", icon: "🎯" },
]

export function ArenaContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")
  const pageParam = searchParams.get("page")

  const [posts, setPosts] = useState<PostWithAuthor[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [activeCategory, setActiveCategory] = useState(categoryParam || "all")
  const [currentPage, setCurrentPage] = useState(pageParam ? parseInt(pageParam) : 1)
  const [totalCount, setTotalCount] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [infiniteScroll, setInfiniteScroll] = useState(false)

  const supabase = createClient()
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const isLoadingRef = useRef(false)

  // Load infinite scroll preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(INFINITE_SCROLL_KEY)
    if (saved !== null) {
      setInfiniteScroll(saved === "true")
    }
  }, [])

  const toggleInfiniteScroll = () => {
    const newValue = !infiniteScroll
    setInfiniteScroll(newValue)
    localStorage.setItem(INFINITE_SCROLL_KEY, String(newValue))
  }

  useEffect(() => {
    setActiveCategory(categoryParam || "all")
    setCurrentPage(1)
  }, [categoryParam])

  const fetchPosts = useCallback(async (page: number, append = false): Promise<void> => {
    if (append) {
      setLoadingMore(true)
    } else {
      setLoading(true)
    }

    const from = (page - 1) * POSTS_PER_PAGE
    const to = from + POSTS_PER_PAGE - 1

    let query = (supabase
      .from("posts") as any)
      .select(`
        *,
        author:profiles!posts_author_id_fkey(*)
      `, { count: 'exact' })
      .eq("published", true)
      .order("created_at", { ascending: false })
      .range(from, to)

    if (activeCategory && activeCategory !== "all") {
      query = query.eq("category", activeCategory)
    }

    const { data, error, count } = await query

    if (error) {
      console.error("Error fetching posts:", error)
    } else {
      if (append) {
        setPosts(prev => [...prev, ...(data as PostWithAuthor[] || [])])
      } else {
        setPosts(data as PostWithAuthor[] || [])
      }
      setTotalCount(count || 0)
      setHasMore((count || 0) > page * POSTS_PER_PAGE)
    }

    setLoading(false)
    setLoadingMore(false)
  }, [activeCategory, supabase])

  useEffect(() => {
    fetchPosts(1)
  }, [activeCategory, fetchPosts])

  const loadMore = useCallback(() => {
    if (isLoadingRef.current || !hasMore) return
    isLoadingRef.current = true
    const nextPage = currentPage + 1
    setCurrentPage(nextPage)
    fetchPosts(nextPage, true).finally(() => {
      isLoadingRef.current = false
    })
  }, [currentPage, hasMore, fetchPosts])

  // Infinite scroll observer
  useEffect(() => {
    if (!infiniteScroll || !hasMore || loading) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          loadMore()
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    )

    const currentRef = loadMoreRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [infiniteScroll, hasMore, loading, loadingMore, loadMore])

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE)

  return (
    <>
      {/* Mobile Categories - Horizontal Scroll */}
      <div className="lg:hidden mb-6 -mx-4 px-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={cat.slug === "all" ? "/arena" : `/arena?category=${cat.slug}`}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                activeCategory === cat.slug
                  ? "bg-[var(--arena-text)] text-[var(--arena-bg)]"
                  : "bg-[var(--arena-card)] border border-[var(--arena-border)] text-[var(--arena-text-muted)] hover:border-[var(--arena-text)]/30"
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop Layout with Sidebar */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar - Desktop Only */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="hidden lg:block lg:w-56 flex-shrink-0"
        >
          <div className="lg:sticky lg:top-24">
            <h3 className="text-xs font-semibold text-[var(--arena-text-muted)] uppercase tracking-wider mb-3 px-3">
              Categories
            </h3>
            <nav className="space-y-1">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={cat.slug === "all" ? "/arena" : `/arena?category=${cat.slug}`}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    activeCategory === cat.slug
                      ? "bg-[var(--arena-text)] text-[var(--arena-bg)]"
                      : "text-[var(--arena-text-muted)] hover:bg-[var(--arena-text)]/5 hover:text-[var(--arena-text)]"
                  }`}
                >
                  <span>{cat.icon}</span>
                  {cat.label}
                </Link>
              ))}
            </nav>

            {/* Decorative Element */}
            <div className="mt-8 p-4 bg-[var(--arena-card)] rounded-xl border border-[var(--arena-border)]">
              <p className="font-instrument-serif text-lg text-[var(--arena-text)] mb-2">
                Think. Build. Do. Grow.
              </p>
              <p className="text-xs text-[var(--arena-text-muted)]">
                Share your journey with fellow builders and doers.
              </p>
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 min-w-0"
        >
          {/* Hero Section - Centered above posts */}
          <div className="text-center mb-10">
            <h1 className="font-instrument-serif text-4xl sm:text-5xl text-[var(--arena-text)] mb-3">
              The Arena
            </h1>
            <p className="text-[var(--arena-text-muted)] max-w-xl mx-auto">
              Where builders share ideas, discuss ventures, and forge connections.
              Step in, speak up, and grow together.
            </p>
          </div>
          {/* Posts Grid */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <PostCardSkeleton key={i} />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <EmptyPostState category={activeCategory !== "all" ? activeCategory : undefined} />
          ) : (
            <>
              <div className="space-y-4">
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
                  >
                    <PostCard post={post} />
                  </motion.div>
                ))}
              </div>

              {/* Load More / Pagination */}
              {hasMore && (
                <div ref={loadMoreRef} className="mt-8 text-center">
                  {infiniteScroll ? (
                    // Infinite scroll loading indicator
                    <div className="py-4">
                      <Loader2 className="w-5 h-5 animate-spin text-[var(--arena-text-faint)] mx-auto" />
                      <p className="mt-2 text-sm text-[var(--arena-text-muted)]">
                        Loading more posts...
                      </p>
                    </div>
                  ) : (
                    // Manual load more button
                    <>
                      <button
                        onClick={loadMore}
                        disabled={loadingMore}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--arena-card)] border-2 border-[var(--arena-border)] rounded-xl text-[var(--arena-text)] font-medium hover:border-[var(--arena-text)] hover:bg-[var(--arena-bg)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loadingMore ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          <>
                            Load More Posts
                            <ChevronRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </>
                  )}
                  <p className="mt-3 text-sm text-[var(--arena-text-muted)]">
                    Showing {posts.length} of {totalCount} posts
                  </p>
                </div>
              )}

              {/* All loaded indicator */}
              {!hasMore && posts.length > 0 && totalCount > POSTS_PER_PAGE && (
                <div className="mt-8 text-center">
                  <p className="text-sm text-[var(--arena-text-muted)]">
                    You've reached the end! {totalCount} posts total.
                  </p>
                </div>
              )}

              {/* Infinite Scroll Toggle */}
              {totalCount > POSTS_PER_PAGE && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={toggleInfiniteScroll}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-xs text-[var(--arena-text-faint)] hover:text-[var(--arena-text-muted)] transition-colors"
                  >
                    {infiniteScroll ? (
                      <>
                        <Hand className="w-3.5 h-3.5" />
                        Switch to manual loading
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        Enable infinite scroll
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </>
  )
}
