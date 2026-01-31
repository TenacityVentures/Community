"use client"

import { useEffect, useState, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { PostCard, PostCardSkeleton, EmptyPostState } from "@/components/arena/post-card"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import type { PostWithAuthor } from "@/lib/supabase/types"
import Link from "next/link"

const POSTS_PER_PAGE = 10

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

  const supabase = createClient()

  useEffect(() => {
    setActiveCategory(categoryParam || "all")
    setCurrentPage(1)
  }, [categoryParam])

  const fetchPosts = useCallback(async (page: number, append = false) => {
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

  const loadMore = () => {
    const nextPage = currentPage + 1
    setCurrentPage(nextPage)
    fetchPosts(nextPage, true)
  }

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE)

  return (
    <>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h1 className="font-instrument-serif text-4xl sm:text-5xl text-[#37322f] mb-3">
          The Arena
        </h1>
        <p className="text-[#605A57] max-w-xl mx-auto">
          Where builders share ideas, discuss ventures, and forge connections.
          Step in, speak up, and grow together.
        </p>
      </motion.div>

      {/* Category Filter (Desktop Sidebar Style) */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:w-56 flex-shrink-0"
        >
          <div className="lg:sticky lg:top-24">
            <h3 className="text-xs font-semibold text-[#605A57] uppercase tracking-wider mb-3 px-3">
              Categories
            </h3>
            <nav className="space-y-1">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={cat.slug === "all" ? "/arena" : `/arena?category=${cat.slug}`}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    activeCategory === cat.slug
                      ? "bg-[#37322f] text-white"
                      : "text-[#605A57] hover:bg-[#37322f]/5 hover:text-[#37322f]"
                  }`}
                >
                  <span>{cat.icon}</span>
                  {cat.label}
                </Link>
              ))}
            </nav>

            {/* Decorative Element */}
            <div className="hidden lg:block mt-8 p-4 bg-white rounded-xl border border-[#E0DEDB]">
              <p className="font-instrument-serif text-lg text-[#37322f] mb-2">
                Think. Build. Do. Grow.
              </p>
              <p className="text-xs text-[#605A57]">
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
                <div className="mt-8 text-center">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-[#E0DEDB] rounded-xl text-[#37322f] font-medium hover:border-[#37322f] hover:bg-[#f7f5f3] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <p className="mt-3 text-sm text-[#605A57]">
                    Showing {posts.length} of {totalCount} posts
                  </p>
                </div>
              )}

              {/* All loaded indicator */}
              {!hasMore && posts.length > 0 && totalCount > POSTS_PER_PAGE && (
                <div className="mt-8 text-center">
                  <p className="text-sm text-[#605A57]">
                    You've reached the end! {totalCount} posts total.
                  </p>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </>
  )
}
