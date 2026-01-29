"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { ArenaHeader } from "@/components/arena/arena-header"
import { PostCard, PostCardSkeleton, EmptyPostState } from "@/components/arena/post-card"
import { motion } from "framer-motion"
import type { PostWithAuthor, PostCategory } from "@/lib/supabase/types"
import Link from "next/link"

const categories = [
  { slug: "all", label: "All Posts", icon: "✨" },
  { slug: "building", label: "Building", icon: "🛠️" },
  { slug: "ideas", label: "Ideas", icon: "💡" },
  { slug: "stories", label: "Stories", icon: "📖" },
  { slug: "opportunities", label: "Opportunities", icon: "🤝" },
  { slug: "challenges", label: "Challenges", icon: "🎯" },
]

export default function ArenaPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")
  const [posts, setPosts] = useState<PostWithAuthor[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState(categoryParam || "all")
  const supabase = createClient()

  useEffect(() => {
    setActiveCategory(categoryParam || "all")
  }, [categoryParam])

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true)

      let query = (supabase
        .from("posts") as any)
        .select(`
          *,
          author:profiles!posts_author_id_fkey(*)
        `)
        .eq("published", true)
        .order("created_at", { ascending: false })

      if (activeCategory && activeCategory !== "all") {
        query = query.eq("category", activeCategory)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error fetching posts:", error)
      } else {
        setPosts(data as PostWithAuthor[] || [])
      }

      setLoading(false)
    }

    fetchPosts()
  }, [activeCategory])

  return (
    <div className="min-h-screen bg-[#f7f5f3]">
      <ArenaHeader />

      <main className="max-w-[1060px] mx-auto px-4 py-8">
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
              <div className="space-y-4">
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <PostCard post={post} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#37322f]/6 mt-16">
        <div className="max-w-[1060px] mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#605A57]">
              © {new Date().getFullYear()} Tenacity. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-[#605A57]">
              <Link href="/" className="hover:text-[#37322f] transition-colors">
                Home
              </Link>
              <Link href="/manifesto" className="hover:text-[#37322f] transition-colors">
                Manifesto
              </Link>
              <Link href="/arena" className="hover:text-[#37322f] transition-colors">
                The Arena
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
