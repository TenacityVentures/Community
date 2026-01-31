"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
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
  BookmarkCheck,
  MoreHorizontal,
  Send,
  Flame,
  Lightbulb,
  Rocket,
  Dumbbell,
  Heart,
  Trash2,
  Pencil,
  Loader2,
  Reply,
  ChevronDown,
  ChevronUp,
  Check,
  CornerDownRight,
} from "lucide-react"
import type { PostWithAuthor, CommentWithAuthor, PostCategory, ReactionType, Reaction, CommentWithReplies } from "@/lib/supabase/types"

const COMMENTS_PER_PAGE = 5

const categoryStyles: Record<PostCategory, { bg: string; text: string; icon: string }> = {
  building: { bg: "bg-amber-50", text: "text-amber-700", icon: "🛠️" },
  ideas: { bg: "bg-yellow-50", text: "text-yellow-700", icon: "💡" },
  stories: { bg: "bg-blue-50", text: "text-blue-700", icon: "📖" },
  opportunities: { bg: "bg-green-50", text: "text-green-700", icon: "🤝" },
  challenges: { bg: "bg-purple-50", text: "text-purple-700", icon: "🎯" },
}

const reactionConfig: Record<ReactionType, { icon: React.ReactNode; label: string; color: string }> = {
  fire: { icon: <Flame className="w-4 h-4" />, label: "Fire", color: "text-orange-500" },
  lightbulb: { icon: <Lightbulb className="w-4 h-4" />, label: "Idea", color: "text-yellow-500" },
  launch: { icon: <Rocket className="w-4 h-4" />, label: "Launch", color: "text-blue-500" },
  tenacity: { icon: <Dumbbell className="w-4 h-4" />, label: "Tenacity", color: "text-purple-500" },
  respect: { icon: <Heart className="w-4 h-4" />, label: "Respect", color: "text-red-500" },
}

// Build comment tree from flat list
function buildCommentTree(comments: CommentWithAuthor[]): CommentWithReplies[] {
  const commentMap = new Map<string, CommentWithReplies>()
  const roots: CommentWithReplies[] = []

  comments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, replies: [] })
  })

  comments.forEach(comment => {
    const node = commentMap.get(comment.id)!
    if (comment.parent_id) {
      const parent = commentMap.get(comment.parent_id)
      if (parent) {
        parent.replies = parent.replies || []
        parent.replies.push(node)
      } else {
        roots.push(node)
      }
    } else {
      roots.push(node)
    }
  })

  return roots
}

// Minimal, slick comment component
function CommentItem({
  comment,
  postId,
  user,
  profile,
  supabase,
  onDelete,
  onUpdate,
  onReply,
  depth = 0,
}: {
  comment: CommentWithReplies
  postId: string
  user: any
  profile: any
  supabase: any
  onDelete: (id: string) => void
  onUpdate: (id: string, content: string) => void
  onReply: (parentId: string, content: string) => Promise<void>
  depth?: number
}) {
  const [showActions, setShowActions] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [showReplies, setShowReplies] = useState(depth < 2)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const isAuthor = user?.id === comment.author_id
  const hasReplies = comment.replies && comment.replies.length > 0
  const maxDepth = 3

  const handleEdit = async () => {
    if (!editContent.trim()) return
    setSubmitting(true)
    await onUpdate(comment.id, editContent.trim())
    setIsEditing(false)
    setSubmitting(false)
  }

  const handleReply = async () => {
    if (!replyContent.trim()) return
    setSubmitting(true)
    await onReply(comment.id, replyContent.trim())
    setReplyContent("")
    setIsReplying(false)
    setSubmitting(false)
    setShowReplies(true)
  }

  return (
    <div className={`group ${depth > 0 ? 'ml-8 pl-4 border-l border-[#E0DEDB]/60' : ''}`}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="relative"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => !isEditing && setShowActions(false)}
      >
        {/* Comment header */}
        <div className="flex items-center gap-2 mb-1.5">
          <Link href={`/arena/profile/${comment.author.username}`} className="flex-shrink-0">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#37322f] to-[#5a524d] text-white flex items-center justify-center text-[10px] font-medium overflow-hidden ring-2 ring-white">
              {comment.author.avatar_url ? (
                <img src={comment.author.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                (comment.author.full_name?.[0] || comment.author.username[0]).toUpperCase()
              )}
            </div>
          </Link>
          <Link
            href={`/arena/profile/${comment.author.username}`}
            className="text-sm font-medium text-[#37322f] hover:underline"
          >
            {comment.author.full_name || comment.author.username}
          </Link>
          <span className="text-xs text-[#9C9894]">·</span>
          <span className="text-xs text-[#9C9894]">
            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
          </span>
          {comment.updated_at !== comment.created_at && (
            <span className="text-[10px] text-[#9C9894] italic">(edited)</span>
          )}
        </div>

        {/* Comment content */}
        {isEditing ? (
          <div className="ml-8 space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-[#f7f5f3] border-0 rounded-lg px-3 py-2 text-sm text-[#37322f] focus:outline-none focus:ring-2 focus:ring-[#37322f]/20 resize-none transition-all"
              rows={2}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => { setIsEditing(false); setEditContent(comment.content) }}
                className="px-3 py-1 text-xs text-[#605A57] hover:text-[#37322f] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                disabled={submitting || !editContent.trim()}
                className="px-3 py-1 text-xs bg-[#37322f] text-white rounded-md hover:bg-[#4a443f] disabled:opacity-50 flex items-center gap-1 transition-colors"
              >
                {submitting && <Loader2 className="w-3 h-3 animate-spin" />}
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="ml-8 text-[#37322f] text-sm leading-relaxed whitespace-pre-wrap break-words">
            {comment.content}
          </p>
        )}

        {/* Actions - appear on hover */}
        {!isEditing && (
          <div className={`ml-8 mt-1.5 flex items-center gap-3 transition-opacity duration-150 ${showActions || isReplying ? 'opacity-100' : 'opacity-0'}`}>
            {user && depth < maxDepth && (
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="flex items-center gap-1 text-xs text-[#9C9894] hover:text-[#37322f] transition-colors"
              >
                <Reply className="w-3 h-3" />
                Reply
              </button>
            )}
            {isAuthor && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 text-xs text-[#9C9894] hover:text-[#37322f] transition-colors"
                >
                  <Pencil className="w-3 h-3" />
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-1 text-xs text-[#9C9894] hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </>
            )}
          </div>
        )}

        {/* Reply count toggle */}
        {hasReplies && (
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="ml-8 mt-2 flex items-center gap-1 text-xs text-[#605A57] hover:text-[#37322f] transition-colors"
          >
            {showReplies ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            <span>{comment.replies?.length} {comment.replies?.length === 1 ? 'reply' : 'replies'}</span>
          </button>
        )}

        {/* Reply form */}
        <AnimatePresence>
          {isReplying && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="ml-8 mt-3 overflow-hidden"
            >
              <div className="flex gap-2 items-start">
                <CornerDownRight className="w-4 h-4 text-[#9C9894] mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder={`Reply to ${comment.author.full_name || comment.author.username}...`}
                    className="w-full bg-[#f7f5f3] border-0 rounded-lg px-3 py-2 text-sm text-[#37322f] focus:outline-none focus:ring-2 focus:ring-[#37322f]/20 resize-none placeholder:text-[#9C9894] transition-all"
                    rows={2}
                    autoFocus
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => { setIsReplying(false); setReplyContent("") }}
                      className="px-3 py-1 text-xs text-[#605A57] hover:text-[#37322f] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReply}
                      disabled={submitting || !replyContent.trim()}
                      className="px-3 py-1 text-xs bg-[#37322f] text-white rounded-md hover:bg-[#4a443f] disabled:opacity-50 flex items-center gap-1 transition-colors"
                    >
                      {submitting && <Loader2 className="w-3 h-3 animate-spin" />}
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nested replies */}
        <AnimatePresence>
          {showReplies && hasReplies && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 space-y-4"
            >
              {comment.replies?.map(reply => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  postId={postId}
                  user={user}
                  profile={profile}
                  supabase={supabase}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                  onReply={onReply}
                  depth={depth + 1}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Delete confirmation - minimal modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-5 max-w-xs w-full shadow-2xl"
            >
              <p className="text-sm text-[#37322f] mb-4">Delete this comment?</p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-sm text-[#605A57] hover:text-[#37322f] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { onDelete(comment.id); setShowDeleteConfirm(false) }}
                  className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function PostPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const { user, profile } = useAuth()
  const supabase = createClient()

  const [post, setPost] = useState<PostWithAuthor | null>(null)
  const [comments, setComments] = useState<CommentWithAuthor[]>([])
  const [reactions, setReactions] = useState<Reaction[]>([])
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState("")
  const [submittingComment, setSubmittingComment] = useState(false)
  const [showReactions, setShowReactions] = useState(false)
  const [showPostMenu, setShowPostMenu] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [commentsPage, setCommentsPage] = useState(1)
  const [hasMoreComments, setHasMoreComments] = useState(false)
  const [loadingMoreComments, setLoadingMoreComments] = useState(false)
  const [totalComments, setTotalComments] = useState(0)
  const [rootCommentCount, setRootCommentCount] = useState(0)

  const postMenuRef = useRef<HTMLDivElement>(null)
  const reactionsRef = useRef<HTMLDivElement>(null)

  const isAuthor = user?.id === post?.author_id

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (postMenuRef.current && !postMenuRef.current.contains(event.target as Node)) {
        setShowPostMenu(false)
      }
      if (reactionsRef.current && !reactionsRef.current.contains(event.target as Node)) {
        setShowReactions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const fetchReactions = useCallback(async (postId: string) => {
    const { data } = await (supabase.from("reactions") as any).select("*").eq("post_id", postId)
    if (data) {
      setReactions(data as Reaction[])
      if (user) {
        const myReaction = data.find((r: Reaction) => r.user_id === user.id)
        setUserReaction(myReaction?.type || null)
      }
    }
  }, [supabase, user])

  const fetchBookmark = useCallback(async (postId: string) => {
    if (!user) return
    const { data } = await (supabase.from("bookmarks") as any)
      .select("id")
      .eq("user_id", user.id)
      .eq("post_id", postId)
      .single()
    setIsBookmarked(!!data)
  }, [supabase, user])

  const fetchComments = useCallback(async (postId: string, page: number, append = false) => {
    if (append) setLoadingMoreComments(true)

    // Fetch root comments with pagination
    const from = (page - 1) * COMMENTS_PER_PAGE
    const to = from + COMMENTS_PER_PAGE - 1

    // First get total count of root comments
    const { count: rootCount } = await (supabase.from("comments") as any)
      .select("id", { count: 'exact', head: true })
      .eq("post_id", postId)
      .is("parent_id", null)

    setRootCommentCount(rootCount || 0)

    // Get paginated root comments
    const { data: rootComments } = await (supabase.from("comments") as any)
      .select(`*, author:profiles!comments_author_id_fkey(*)`)
      .eq("post_id", postId)
      .is("parent_id", null)
      .order("created_at", { ascending: false })
      .range(from, to)

    if (rootComments && rootComments.length > 0) {
      // Get all replies for these root comments
      const rootIds = rootComments.map((c: any) => c.id)
      const { data: replies } = await (supabase.from("comments") as any)
        .select(`*, author:profiles!comments_author_id_fkey(*)`)
        .eq("post_id", postId)
        .in("parent_id", rootIds)
        .order("created_at", { ascending: true })

      const allComments = [...rootComments, ...(replies || [])]

      if (append) {
        setComments(prev => {
          const existingIds = new Set(prev.map(c => c.id))
          const newComments = allComments.filter((c: any) => !existingIds.has(c.id))
          return [...prev, ...newComments]
        })
      } else {
        setComments(allComments as CommentWithAuthor[])
      }
    } else if (!append) {
      setComments([])
    }

    // Get total comment count
    const { count: total } = await (supabase.from("comments") as any)
      .select("id", { count: 'exact', head: true })
      .eq("post_id", postId)

    setTotalComments(total || 0)
    setHasMoreComments((rootCount || 0) > page * COMMENTS_PER_PAGE)
    setLoadingMoreComments(false)
  }, [supabase])

  useEffect(() => {
    async function fetchPost() {
      const { data: postData, error: postError } = await (supabase.from("posts") as any)
        .select(`*, author:profiles!posts_author_id_fkey(*)`)
        .eq("slug", slug)
        .single()

      if (postError) {
        console.error("Error fetching post:", postError)
        setLoading(false)
        return
      }

      setPost(postData as PostWithAuthor)

      await (supabase.from("posts") as any)
        .update({ view_count: (postData.view_count || 0) + 1 })
        .eq("id", postData.id)

      await Promise.all([
        fetchComments(postData.id, 1),
        fetchReactions(postData.id),
        fetchBookmark(postData.id),
      ])

      setLoading(false)
    }

    fetchPost()
  }, [slug, fetchComments, fetchReactions, fetchBookmark, supabase])

  useEffect(() => {
    if (user && reactions.length > 0) {
      const myReaction = reactions.find(r => r.user_id === user.id)
      setUserReaction(myReaction?.type || null)
    }
  }, [user, reactions])

  const loadMoreComments = () => {
    const nextPage = commentsPage + 1
    setCommentsPage(nextPage)
    if (post) fetchComments(post.id, nextPage, true)
  }

  const handleReaction = async (type: ReactionType) => {
    if (!user || !post) return
    setShowReactions(false)

    if (userReaction === type) {
      setUserReaction(null)
      setReactions(reactions.filter(r => r.user_id !== user.id))
      await (supabase.from("reactions") as any).delete().eq("user_id", user.id).eq("post_id", post.id)
    } else {
      setUserReaction(type)
      if (userReaction) {
        setReactions(reactions.map(r => r.user_id === user.id ? { ...r, type } : r))
        await (supabase.from("reactions") as any).update({ type }).eq("user_id", user.id).eq("post_id", post.id)
      } else {
        const newReaction = { user_id: user.id, post_id: post.id, type }
        setReactions([...reactions, newReaction as Reaction])
        await (supabase.from("reactions") as any).insert(newReaction)
      }
    }
  }

  const handleBookmark = async () => {
    if (!user || !post) {
      router.push('/arena/login')
      return
    }

    const wasBookmarked = isBookmarked
    setIsBookmarked(!isBookmarked)

    if (wasBookmarked) {
      await (supabase.from("bookmarks") as any).delete().eq("user_id", user.id).eq("post_id", post.id)
    } else {
      await (supabase.from("bookmarks") as any).insert({ user_id: user.id, post_id: post.id })
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !post || !newComment.trim()) return

    setSubmittingComment(true)
    const { data, error } = await (supabase.from("comments") as any)
      .insert({ post_id: post.id, author_id: user.id, content: newComment.trim() })
      .select(`*, author:profiles!comments_author_id_fkey(*)`)
      .single()

    if (!error && data) {
      setComments(prev => [data as CommentWithAuthor, ...prev])
      setNewComment("")
      setTotalComments(prev => prev + 1)
      setRootCommentCount(prev => prev + 1)
    }
    setSubmittingComment(false)
  }

  const handleReplyToComment = async (parentId: string, content: string) => {
    if (!user || !post) return
    const { data, error } = await (supabase.from("comments") as any)
      .insert({ post_id: post.id, author_id: user.id, parent_id: parentId, content })
      .select(`*, author:profiles!comments_author_id_fkey(*)`)
      .single()

    if (!error && data) {
      setComments(prev => [...prev, data as CommentWithAuthor])
      setTotalComments(prev => prev + 1)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    const repliesToDelete = comments.filter(c => c.parent_id === commentId)
    const isRoot = !comments.find(c => c.id === commentId)?.parent_id

    for (const reply of repliesToDelete) {
      await (supabase.from("comments") as any).delete().eq("id", reply.id)
    }
    await (supabase.from("comments") as any).delete().eq("id", commentId)

    setComments(comments.filter(c => c.id !== commentId && c.parent_id !== commentId))
    setTotalComments(prev => prev - 1 - repliesToDelete.length)
    if (isRoot) setRootCommentCount(prev => prev - 1)
  }

  const handleUpdateComment = async (commentId: string, content: string) => {
    await (supabase.from("comments") as any)
      .update({ content, updated_at: new Date().toISOString() })
      .eq("id", commentId)
    setComments(comments.map(c => c.id === commentId ? { ...c, content, updated_at: new Date().toISOString() } : c))
  }

  const handleDeletePost = async () => {
    if (!user || !post || !isAuthor) return
    setDeleting(true)
    await (supabase.from("reactions") as any).delete().eq("post_id", post.id)
    await (supabase.from("comments") as any).delete().eq("post_id", post.id)
    await (supabase.from("bookmarks") as any).delete().eq("post_id", post.id)
    const { error } = await (supabase.from("posts") as any).delete().eq("id", post.id)
    if (error) {
      setDeleting(false)
      setShowDeleteConfirm(false)
    } else {
      router.push("/arena")
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: post?.title, url: window.location.href })
    } else {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const reactionCounts = reactions.reduce((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1
    return acc
  }, {} as Record<ReactionType, number>)

  const totalReactions = reactions.length
  const commentTree = buildCommentTree(comments)

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f5f3]">
        <ArenaHeader />
        <main className="max-w-[800px] mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-32 bg-[#E0DEDB] rounded" />
            <div className="h-10 w-3/4 bg-[#E0DEDB] rounded" />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#E0DEDB] rounded-full" />
              <div className="space-y-2">
                <div className="h-4 w-24 bg-[#E0DEDB] rounded" />
                <div className="h-3 w-32 bg-[#E0DEDB] rounded" />
              </div>
            </div>
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
          <Link href="/arena" className="inline-flex items-center gap-2 text-[#37322f] hover:text-[#605A57]">
            <ArrowLeft className="w-4 h-4" />Back to The Arena
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
        <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Link href="/arena" className="inline-flex items-center gap-2 text-[#9C9894] hover:text-[#37322f] transition-colors mb-6 text-sm">
            <ArrowLeft className="w-4 h-4" />Back
          </Link>

          <header className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${category.bg} ${category.text}`}>
                {category.icon} {post.category}
              </span>

              {isAuthor && (
                <div className="relative" ref={postMenuRef}>
                  <button onClick={() => setShowPostMenu(!showPostMenu)} className="p-1.5 text-[#9C9894] hover:text-[#37322f] hover:bg-[#E0DEDB]/50 rounded-lg transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                  <AnimatePresence>
                    {showPostMenu && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-[#E0DEDB]/60 py-1 min-w-[140px] z-10">
                        <Link href={`/arena/edit/${post.slug}`} className="flex items-center gap-2 px-3 py-2 text-sm text-[#37322f] hover:bg-[#f7f5f3] transition-colors" onClick={() => setShowPostMenu(false)}>
                          <Pencil className="w-4 h-4 text-[#9C9894]" />Edit
                        </Link>
                        <button onClick={() => { setShowPostMenu(false); setShowDeleteConfirm(true) }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                          <Trash2 className="w-4 h-4" />Delete
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            <h1 className="font-instrument-serif text-3xl sm:text-4xl text-[#37322f] mb-6 leading-tight">{post.title}</h1>

            <div className="flex items-center gap-3">
              <Link href={`/arena/profile/${post.author.username}`}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#37322f] to-[#5a524d] text-white flex items-center justify-center text-sm font-medium overflow-hidden ring-2 ring-white shadow-sm">
                  {post.author.avatar_url ? (
                    <img src={post.author.avatar_url} alt={post.author.full_name || post.author.username} className="w-full h-full object-cover" />
                  ) : (
                    (post.author.full_name?.[0] || post.author.username[0]).toUpperCase()
                  )}
                </div>
              </Link>
              <div>
                <Link href={`/arena/profile/${post.author.username}`} className="font-medium text-[#37322f] hover:underline text-sm">
                  {post.author.full_name || post.author.username}
                </Link>
                <p className="text-xs text-[#9C9894]">{timeAgo}</p>
              </div>
            </div>
          </header>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              {post.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-[#37322f]/5 text-[#605A57] text-xs rounded-md">#{tag}</span>
              ))}
            </div>
          )}

          <div className="bg-white rounded-2xl border border-[#E0DEDB]/60 p-6 sm:p-8 mb-6 shadow-sm">
            <PostContent content={post.content} />
          </div>

          {/* Actions Bar */}
          <div className="flex items-center justify-between py-4 border-y border-[#E0DEDB]/60 mb-8">
            <div className="flex items-center gap-5">
              <div className="relative" ref={reactionsRef}>
                <button onClick={() => user ? setShowReactions(!showReactions) : router.push('/arena/login')} className={`flex items-center gap-1.5 transition-colors ${userReaction ? reactionConfig[userReaction].color : "text-[#9C9894] hover:text-[#37322f]"}`}>
                  {userReaction ? reactionConfig[userReaction].icon : <Dumbbell className="w-5 h-5" />}
                  <span className="text-sm font-medium">{totalReactions > 0 ? totalReactions : ""}</span>
                </button>
                <AnimatePresence>
                  {showReactions && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-lg border border-[#E0DEDB]/60 p-1.5 flex gap-0.5 z-10">
                      {(Object.entries(reactionConfig) as [ReactionType, typeof reactionConfig[ReactionType]][]).map(([type, config]) => (
                        <button key={type} title={config.label} onClick={() => handleReaction(type)} className={`p-2 rounded-lg transition-all ${userReaction === type ? `${config.color} bg-[#f7f5f3]` : "hover:bg-[#f7f5f3] text-[#9C9894] hover:scale-110"}`}>
                          {config.icon}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <span className="flex items-center gap-1.5 text-[#9C9894]">
                <MessageCircle className="w-5 h-5" /><span className="text-sm font-medium">{totalComments}</span>
              </span>

              <span className="flex items-center gap-1.5 text-[#9C9894]">
                <Eye className="w-5 h-5" /><span className="text-sm font-medium">{post.view_count}</span>
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button onClick={handleShare} className="p-2 text-[#9C9894] hover:text-[#37322f] hover:bg-[#f7f5f3] rounded-lg transition-colors">
                {copied ? <Check className="w-5 h-5 text-green-600" /> : <Share2 className="w-5 h-5" />}
              </button>
              <button onClick={handleBookmark} className={`p-2 rounded-lg transition-colors ${isBookmarked ? 'text-[#37322f] bg-[#37322f]/10' : 'text-[#9C9894] hover:text-[#37322f] hover:bg-[#f7f5f3]'}`}>
                {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <section>
            <h2 className="text-lg font-medium text-[#37322f] mb-6">Discussion</h2>

            {user ? (
              <form onSubmit={handleSubmitComment} className="mb-8">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#37322f] to-[#5a524d] text-white flex items-center justify-center text-xs font-medium overflow-hidden ring-2 ring-white flex-shrink-0">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      (profile?.full_name?.[0] || profile?.username?.[0] || "U").toUpperCase()
                    )}
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your thoughts..."
                      rows={3}
                      className="w-full bg-white border border-[#E0DEDB]/60 rounded-xl px-4 py-3 text-sm text-[#37322f] focus:outline-none focus:border-[#37322f]/30 transition-colors resize-none placeholder:text-[#9C9894]"
                    />
                    <div className="flex justify-end mt-2">
                      <button type="submit" disabled={submittingComment || !newComment.trim()} className="flex items-center gap-2 bg-[#37322F] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4a443f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {submittingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        {submittingComment ? "Posting..." : "Comment"}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="bg-white rounded-xl border border-[#E0DEDB]/60 p-6 text-center mb-8">
                <p className="text-sm text-[#605A57] mb-3">Join the conversation</p>
                <Link href="/arena/login" className="inline-flex items-center gap-2 bg-[#37322F] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4a443f] transition-colors">
                  Enter The Arena
                </Link>
              </div>
            )}

            {commentTree.length === 0 ? (
              <div className="text-center py-12 text-[#9C9894]">
                <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">No comments yet. Start the discussion!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {commentTree.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    postId={post.id}
                    user={user}
                    profile={profile}
                    supabase={supabase}
                    onDelete={handleDeleteComment}
                    onUpdate={handleUpdateComment}
                    onReply={handleReplyToComment}
                  />
                ))}

                {/* Load more comments */}
                {hasMoreComments && (
                  <div className="text-center pt-4">
                    <button
                      onClick={loadMoreComments}
                      disabled={loadingMoreComments}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm text-[#605A57] hover:text-[#37322f] transition-colors disabled:opacity-50"
                    >
                      {loadingMoreComments ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          Load more comments ({rootCommentCount - commentsPage * COMMENTS_PER_PAGE} remaining)
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        </motion.article>
      </main>

      {/* Delete Post Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => !deleting && setShowDeleteConfirm(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
              <h3 className="font-medium text-[#37322f] text-lg mb-2">Delete this post?</h3>
              <p className="text-sm text-[#605A57] mb-6">This will permanently remove "{post.title}" and all its comments.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteConfirm(false)} disabled={deleting} className="flex-1 px-4 py-2.5 text-sm text-[#37322f] hover:bg-[#f7f5f3] rounded-lg transition-colors disabled:opacity-50">
                  Cancel
                </button>
                <button onClick={handleDeletePost} disabled={deleting} className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors">
                  {deleting ? <><Loader2 className="w-4 h-4 animate-spin" />Deleting...</> : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
