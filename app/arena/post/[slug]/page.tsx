"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/supabase/auth-context"
import { ArenaHeader } from "@/components/arena/arena-header"
import { PostContent } from "@/components/arena/post-content"
import { motion, AnimatePresence } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import {
  ArrowLeft,
  MessageCircle,
  Eye,
  Share2,
  Bookmark,
  MoreHorizontal,
  Send,
  Flame,
  Lightbulb,
  Rocket,
  Dumbbell,
  Heart,
} from "lucide-react"
import type { PostWithAuthor, CommentWithAuthor, PostCategory, ReactionType } from "@/lib/supabase/types"

const categoryStyles: Record<PostCategory, { bg: string; text: string; icon: string }> = {
  building: { bg: "bg-amber-50", text: "text-amber-700", icon: "🛠️" },
  ideas: { bg: "bg-yellow-50", text: "text-yellow-700", icon: "💡" },
  stories: { bg: "bg-blue-50", text: "text-blue-700", icon: "📖" },
  opportunities: { bg: "bg-green-50", text: "text-green-700", icon: "🤝" },
  challenges: { bg: "bg-purple-50", text: "text-purple-700", icon: "🎯" },
}

const reactionConfig: Record<ReactionType, { icon: React.ReactNode; label: string }> = {
  fire: { icon: <Flame className="w-4 h-4" />, label: "Fire" },
  lightbulb: { icon: <Lightbulb className="w-4 h-4" />, label: "Idea" },
  launch: { icon: <Rocket className="w-4 h-4" />, label: "Launch" },
  tenacity: { icon: <Dumbbell className="w-4 h-4" />, label: "Tenacity" },
  respect: { icon: <Heart className="w-4 h-4" />, label: "Respect" },
}

export default function PostPage() {
  const params = useParams()
  const slug = params.slug as string
  const { user, profile } = useAuth()
  const supabase = createClient()

  const [post, setPost] = useState<PostWithAuthor | null>(null)
  const [comments, setComments] = useState<CommentWithAuthor[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState("")
  const [submittingComment, setSubmittingComment] = useState(false)
  const [showReactions, setShowReactions] = useState(false)

  useEffect(() => {
    async function fetchPost() {
      const { data: postData, error: postError } = await (supabase
        .from("posts") as any)
        .select(`
          *,
          author:profiles!posts_author_id_fkey(*)
        `)
        .eq("slug", slug)
        .single()

      if (postError) {
        console.error("Error fetching post:", postError)
        setLoading(false)
        return
      }

      setPost(postData as PostWithAuthor)

      // Increment view count
      await (supabase
        .from("posts") as any)
        .update({ view_count: (postData.view_count || 0) + 1 })
        .eq("id", postData.id)

      // Fetch comments
      const { data: commentsData } = await (supabase
        .from("comments") as any)
        .select(`
          *,
          author:profiles!comments_author_id_fkey(*)
        `)
        .eq("post_id", postData.id)
        .order("created_at", { ascending: true })

      setComments((commentsData as CommentWithAuthor[]) || [])
      setLoading(false)
    }

    fetchPost()
  }, [slug])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !post || !newComment.trim()) return

    setSubmittingComment(true)

    const { data, error } = await (supabase
      .from("comments") as any)
      .insert({
        post_id: post.id,
        author_id: user.id,
        content: newComment.trim(),
      })
      .select(`
        *,
        author:profiles!comments_author_id_fkey(*)
      `)
      .single()

    if (!error && data) {
      setComments([...comments, data as CommentWithAuthor])
      setNewComment("")
    }

    setSubmittingComment(false)
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: post?.title,
        url: window.location.href,
      })
    } else {
      await navigator.clipboard.writeText(window.location.href)
      // Could add a toast notification here
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f5f3]">
        <ArenaHeader />
        <main className="max-w-[800px] mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-[#E0DEDB] rounded" />
            <div className="h-12 w-3/4 bg-[#E0DEDB] rounded" />
            <div className="h-4 w-full bg-[#E0DEDB] rounded" />
            <div className="h-4 w-full bg-[#E0DEDB] rounded" />
            <div className="h-4 w-2/3 bg-[#E0DEDB] rounded" />
          </div>
        </main>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#f7f5f3]">
        <ArenaHeader />
        <main className="max-w-[800px] mx-auto px-4 py-16 text-center">
          <h1 className="font-instrument-serif text-3xl text-[#37322f] mb-4">Post Not Found</h1>
          <p className="text-[#605A57] mb-6">This post doesn't exist or has been removed.</p>
          <Link
            href="/arena"
            className="inline-flex items-center gap-2 text-[#37322f] hover:text-[#605A57] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to The Arena
          </Link>
        </main>
      </div>
    )
  }

  const category = categoryStyles[post.category]
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true })

  return (
    <div className="min-h-screen bg-[#f7f5f3]">
      <ArenaHeader />

      <main className="max-w-[800px] mx-auto px-4 py-8">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back Button */}
          <Link
            href="/arena"
            className="inline-flex items-center gap-2 text-[#605A57] hover:text-[#37322f] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to The Arena
          </Link>

          {/* Post Header */}
          <header className="mb-8">
            {/* Category */}
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${category.bg} ${category.text} mb-4`}
            >
              {category.icon} {post.category}
            </span>

            {/* Title */}
            <h1 className="font-instrument-serif text-3xl sm:text-4xl text-[#37322f] mb-4">
              {post.title}
            </h1>

            {/* Author Info */}
            <div className="flex items-center gap-3">
              <Link href={`/arena/profile/${post.author.username}`}>
                <div className="w-12 h-12 rounded-full bg-[#37322f] text-white flex items-center justify-center text-lg font-medium overflow-hidden">
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
              </Link>
              <div>
                <Link
                  href={`/arena/profile/${post.author.username}`}
                  className="font-medium text-[#37322f] hover:text-[#605A57] transition-colors"
                >
                  {post.author.full_name || post.author.username}
                </Link>
                <p className="text-sm text-[#605A57]">
                  @{post.author.username} · {timeAgo}
                </p>
              </div>
            </div>
          </header>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-[#37322f]/5 text-[#605A57] text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Post Content */}
          <div className="bg-white rounded-2xl border border-[#E0DEDB] p-6 sm:p-8 mb-6">
            <PostContent content={post.content} />
          </div>

          {/* Actions Bar */}
          <div className="flex items-center justify-between py-4 border-y border-[#E0DEDB] mb-8">
            <div className="flex items-center gap-4">
              {/* Reactions */}
              <div className="relative">
                <button
                  onClick={() => setShowReactions(!showReactions)}
                  className="flex items-center gap-2 text-[#605A57] hover:text-[#37322f] transition-colors"
                >
                  <Dumbbell className="w-5 h-5" />
                  <span className="text-sm">React</span>
                </button>
                <AnimatePresence>
                  {showReactions && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-lg border border-[#E0DEDB] p-2 flex gap-1"
                    >
                      {Object.entries(reactionConfig).map(([type, config]) => (
                        <button
                          key={type}
                          title={config.label}
                          className="p-2 hover:bg-[#f7f5f3] rounded-lg transition-colors"
                        >
                          {config.icon}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Comments count */}
              <span className="flex items-center gap-2 text-[#605A57]">
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm">{comments.length}</span>
              </span>

              {/* Views */}
              <span className="flex items-center gap-2 text-[#605A57]">
                <Eye className="w-5 h-5" />
                <span className="text-sm">{post.view_count}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 text-[#605A57] hover:text-[#37322f] hover:bg-[#f7f5f3] rounded-lg transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-[#605A57] hover:text-[#37322f] hover:bg-[#f7f5f3] rounded-lg transition-colors">
                <Bookmark className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <section>
            <h2 className="font-instrument-serif text-2xl text-[#37322f] mb-6">
              Discussion ({comments.length})
            </h2>

            {/* Comment Form */}
            {user ? (
              <form onSubmit={handleSubmitComment} className="mb-8">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#37322f] text-white flex items-center justify-center text-sm font-medium overflow-hidden flex-shrink-0">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.full_name || profile.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      (profile?.full_name?.[0] || profile?.username?.[0] || "U").toUpperCase()
                    )}
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Join the discussion..."
                      rows={3}
                      className="w-full border-2 border-[#E0DEDB] rounded-xl px-4 py-3 text-[#37322f] focus:outline-none focus:border-[#37322f] transition-colors resize-none"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        type="submit"
                        disabled={submittingComment || !newComment.trim()}
                        className="flex items-center gap-2 bg-[#37322F] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4a443f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-4 h-4" />
                        {submittingComment ? "Posting..." : "Comment"}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="bg-[#f7f5f3] rounded-xl p-6 text-center mb-8">
                <p className="text-[#605A57] mb-3">Join the conversation</p>
                <Link
                  href="/arena/login"
                  className="inline-flex items-center gap-2 bg-[#37322F] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4a443f] transition-colors"
                >
                  Enter The Arena
                </Link>
              </div>
            )}

            {/* Comments List */}
            {comments.length === 0 ? (
              <div className="text-center py-8 text-[#605A57]">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {comments.map((comment, index) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex gap-3"
                  >
                    <Link href={`/arena/profile/${comment.author.username}`}>
                      <div className="w-10 h-10 rounded-full bg-[#37322f] text-white flex items-center justify-center text-sm font-medium overflow-hidden flex-shrink-0">
                        {comment.author.avatar_url ? (
                          <img
                            src={comment.author.avatar_url}
                            alt={comment.author.full_name || comment.author.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          (comment.author.full_name?.[0] || comment.author.username[0]).toUpperCase()
                        )}
                      </div>
                    </Link>
                    <div className="flex-1">
                      <div className="bg-white rounded-xl border border-[#E0DEDB] p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <Link
                              href={`/arena/profile/${comment.author.username}`}
                              className="font-medium text-[#37322f] hover:text-[#605A57] transition-colors"
                            >
                              {comment.author.full_name || comment.author.username}
                            </Link>
                            <span className="text-sm text-[#605A57] ml-2">
                              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                            </span>
                          </div>
                          <button className="p-1 text-[#605A57] hover:text-[#37322f] transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[#37322f] whitespace-pre-wrap">{comment.content}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </motion.article>
      </main>
    </div>
  )
}
