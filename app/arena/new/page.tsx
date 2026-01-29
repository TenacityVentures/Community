"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/supabase/auth-context"
import { RichTextEditor } from "@/components/arena/rich-text-editor"
import { motion } from "framer-motion"
import { ArrowLeft, X } from "lucide-react"
import type { PostCategory } from "@/lib/supabase/types"

const categories: { value: PostCategory; label: string; icon: string; description: string }[] = [
  { value: "building", label: "Building", icon: "🛠️", description: "Projects, code, products" },
  { value: "ideas", label: "Ideas", icon: "💡", description: "Concepts, pitches, feedback requests" },
  { value: "stories", label: "Stories", icon: "📖", description: "Journeys, lessons, experiences" },
  { value: "opportunities", label: "Opportunities", icon: "🤝", description: "Jobs, collabs, partnerships" },
  { value: "challenges", label: "Challenges", icon: "🎯", description: "Hackathons, community challenges" },
]

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 80) + "-" + Date.now().toString(36)
}

function extractExcerpt(content: string): string {
  try {
    const parsed = JSON.parse(content)
    const textContent = parsed.content
      ?.map((node: { content?: { text?: string }[] }) =>
        node.content?.map((c: { text?: string }) => c.text || "").join("")
      )
      .join(" ")
      .trim()

    return textContent?.substring(0, 200) || ""
  } catch {
    return ""
  }
}

export default function NewPostPage() {
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()
  const supabase = createClient()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState<PostCategory | "">("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/arena/login")
    }
  }, [user, authLoading, router])

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      const tag = tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, "")
      if (tag && !tags.includes(tag) && tags.length < 5) {
        setTags([...tags, tag])
        setTagInput("")
      }
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!title.trim()) {
      setError("Please add a title")
      return
    }
    if (!category) {
      setError("Please select a category")
      return
    }
    if (!content || content === "{}") {
      setError("Please add some content")
      return
    }

    setSubmitting(true)

    const slug = generateSlug(title)
    const excerpt = extractExcerpt(content)

    const { data, error: insertError } = await (supabase
      .from("posts") as any)
      .insert({
        author_id: user!.id,
        title: title.trim(),
        slug,
        content: JSON.parse(content),
        excerpt,
        category: category as PostCategory,
        tags: tags.length > 0 ? tags : null,
        published: true,
      })
      .select()
      .single()

    if (insertError) {
      console.error("Error creating post:", insertError)
      setError("Failed to create post. Please try again.")
      setSubmitting(false)
      return
    }

    router.push(`/arena/post/${slug}`)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f7f5f3] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#37322f] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#f7f5f3]">
      {/* Header */}
      <header className="w-full border-b border-[#37322f]/6 bg-[#f7f5f3] sticky top-0 z-40">
        <div className="max-w-[800px] mx-auto px-4">
          <nav className="flex items-center justify-between py-4">
            <Link
              href="/arena"
              className="flex items-center gap-2 text-[#605A57] hover:text-[#37322f] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Arena
            </Link>
            <button
              onClick={handleSubmit}
              disabled={submitting || !title.trim() || !category}
              className="bg-[#37322F] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#4a443f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Publishing..." : "Publish"}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[800px] mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Title */}
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Your post title..."
                className="w-full text-3xl sm:text-4xl font-instrument-serif text-[#37322f] bg-transparent border-none focus:outline-none placeholder:text-[#605A57]/50"
                maxLength={150}
              />
              <p className="text-xs text-[#605A57] mt-2">
                {title.length}/150 characters
              </p>
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-[#37322f] mb-3">
                Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200 ${
                      category === cat.value
                        ? "border-[#37322f] bg-[#37322f]/5"
                        : "border-[#E0DEDB] hover:border-[#37322f]/30"
                    }`}
                  >
                    <span className="text-xl mb-1">{cat.icon}</span>
                    <span className="text-sm font-medium text-[#37322f]">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-[#37322f] mb-2">
                Tags <span className="text-[#605A57] font-normal">(optional, max 5)</span>
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-[#37322f]/10 text-[#37322f] rounded-full text-sm"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tags (press Enter)"
                disabled={tags.length >= 5}
                className="w-full border-2 border-[#E0DEDB] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#37322f] text-[#37322f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Rich Text Editor */}
            <div>
              <label className="block text-sm font-medium text-[#37322f] mb-2">
                Content
              </label>
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Share your thoughts, ideas, or story..."
              />
            </div>

            {/* Submit Button (Mobile) */}
            <div className="sm:hidden">
              <button
                type="submit"
                disabled={submitting || !title.trim() || !category}
                className="w-full bg-[#37322F] text-white px-5 py-3 rounded-lg font-medium hover:bg-[#4a443f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Publishing..." : "Publish Post"}
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  )
}
