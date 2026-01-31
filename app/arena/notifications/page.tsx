"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/supabase/auth-context"
import { ArenaHeader } from "@/components/arena/arena-header"
import { motion, AnimatePresence } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import {
  ArrowLeft,
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  AtSign,
  Check,
  Loader2,
  Trash2,
} from "lucide-react"

interface Notification {
  id: string
  type: "follow" | "reaction" | "comment" | "reply" | "mention"
  read: boolean
  created_at: string
  actor: {
    id: string
    username: string
    full_name: string | null
    avatar_url: string | null
  }
  post?: {
    id: string
    slug: string
    title: string
  }
  comment?: {
    id: string
    content: string
  }
}

const notificationIcons = {
  follow: UserPlus,
  reaction: Heart,
  comment: MessageCircle,
  reply: MessageCircle,
  mention: AtSign,
}

const notificationMessages = {
  follow: "started following you",
  reaction: "reacted to your post",
  comment: "commented on your post",
  reply: "replied to your comment",
  mention: "mentioned you in a comment",
}

export default function NotificationsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const supabase = createClient()

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "unread">("all")

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/arena/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    async function fetchNotifications() {
      if (!user) return

      setLoading(true)

      let query = (supabase.from("notifications") as any)
        .select(`
          id,
          type,
          read,
          created_at,
          actor:profiles!notifications_actor_id_fkey(id, username, full_name, avatar_url),
          post:posts(id, slug, title),
          comment:comments(id, content)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (filter === "unread") {
        query = query.eq("read", false)
      }

      const { data, error } = await query

      if (!error && data) {
        setNotifications(data)
      }

      setLoading(false)
    }

    fetchNotifications()
  }, [user, filter])

  const markAsRead = async (notificationId: string) => {
    await (supabase.from("notifications") as any)
      .update({ read: true })
      .eq("id", notificationId)

    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    )
  }

  const markAllAsRead = async () => {
    if (!user) return

    await (supabase.from("notifications") as any)
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false)

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = async (notificationId: string) => {
    await (supabase.from("notifications") as any)
      .delete()
      .eq("id", notificationId)

    setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
  }

  const clearAllNotifications = async () => {
    if (!user) return

    await (supabase.from("notifications") as any)
      .delete()
      .eq("user_id", user.id)

    setNotifications([])
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--arena-bg)]">
        <ArenaHeader />
        <main className="max-w-[800px] mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-[var(--arena-border)] rounded" />
            <div className="h-20 bg-[var(--arena-border)] rounded-xl" />
            <div className="h-20 bg-[var(--arena-border)] rounded-xl" />
            <div className="h-20 bg-[var(--arena-border)] rounded-xl" />
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
          transition={{ duration: 0.5 }}
        >
          {/* Back Button */}
          <Link
            href="/arena"
            className="inline-flex items-center gap-2 text-[var(--arena-text-muted)] hover:text-[var(--arena-text)] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to The Arena
          </Link>

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h1 className="font-instrument-serif text-2xl sm:text-3xl text-[var(--arena-text)]">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-[var(--arena-text-muted)] hover:text-[var(--arena-text)] flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-[var(--arena-text)]/5 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span className="hidden sm:inline">Mark all read</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Clear all</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === "all"
                  ? "bg-[var(--arena-text)] text-[var(--arena-bg)]"
                  : "text-[var(--arena-text-muted)] hover:bg-[var(--arena-text)]/5"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === "unread"
                  ? "bg-[var(--arena-text)] text-[var(--arena-bg)]"
                  : "text-[var(--arena-text-muted)] hover:bg-[var(--arena-text)]/5"
              }`}
            >
              Unread
            </button>
          </div>

          {/* Notifications List */}
          {loading ? (
            <div className="py-12 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-[var(--arena-text-faint)]" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="bg-[var(--arena-card)] rounded-2xl border border-[var(--arena-border)] p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--arena-bg)] flex items-center justify-center">
                <Bell className="w-8 h-8 text-[var(--arena-border)]" />
              </div>
              <h3 className="font-instrument-serif text-xl text-[var(--arena-text)] mb-2">
                {filter === "unread" ? "All caught up!" : "No notifications yet"}
              </h3>
              <p className="text-[var(--arena-text-muted)]">
                {filter === "unread"
                  ? "You've read all your notifications."
                  : "When someone interacts with your posts or follows you, you'll see it here."}
              </p>
            </div>
          ) : (
            <div className="bg-[var(--arena-card)] rounded-2xl border border-[var(--arena-border)] overflow-hidden divide-y divide-[var(--arena-border)]">
              <AnimatePresence>
                {notifications.map((notification, index) => {
                  const Icon = notificationIcons[notification.type]
                  const message = notificationMessages[notification.type]

                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.2, delay: index * 0.02 }}
                      className={`flex items-start gap-4 p-4 hover:bg-[var(--arena-bg)] transition-colors relative group ${
                        !notification.read ? "bg-blue-500/10" : ""
                      }`}
                    >
                      {/* Unread indicator */}
                      {!notification.read && (
                        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      )}

                      {/* Actor Avatar */}
                      <Link
                        href={`/arena/profile/${notification.actor.username}`}
                        className="w-10 h-10 rounded-full bg-[var(--arena-text)] text-[var(--arena-bg)] flex items-center justify-center text-sm font-medium overflow-hidden flex-shrink-0"
                      >
                        {notification.actor.avatar_url ? (
                          <img
                            src={notification.actor.avatar_url}
                            alt={notification.actor.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          (notification.actor.full_name?.[0] || notification.actor.username[0]).toUpperCase()
                        )}
                      </Link>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={
                            notification.type === "follow"
                              ? `/arena/profile/${notification.actor.username}`
                              : notification.post
                              ? `/arena/post/${notification.post.slug}`
                              : "/arena"
                          }
                          onClick={() => {
                            if (!notification.read) {
                              markAsRead(notification.id)
                            }
                          }}
                          className="block"
                        >
                          <p className="text-[var(--arena-text)]">
                            <span className="font-medium hover:underline">
                              {notification.actor.full_name || notification.actor.username}
                            </span>{" "}
                            {message}
                          </p>
                          {notification.post && (
                            <p className="text-sm text-[var(--arena-text-muted)] mt-0.5 truncate">
                              "{notification.post.title}"
                            </p>
                          )}
                          {notification.comment && (
                            <p className="text-sm text-[var(--arena-text-muted)] mt-1 line-clamp-2 bg-[var(--arena-bg)] rounded-lg p-2">
                              {notification.comment.content}
                            </p>
                          )}
                          <p className="text-xs text-[var(--arena-text-faint)] mt-1">
                            {formatDistanceToNow(new Date(notification.created_at), {
                              addSuffix: true,
                            })}
                          </p>
                        </Link>
                      </div>

                      {/* Icon */}
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        notification.type === "follow" ? "bg-blue-100 dark:bg-blue-900/30" :
                        notification.type === "reaction" ? "bg-red-100 dark:bg-red-900/30" :
                        "bg-[var(--arena-bg)]"
                      }`}>
                        <Icon className={`w-4 h-4 ${
                          notification.type === "follow" ? "text-blue-500" :
                          notification.type === "reaction" ? "text-red-500" :
                          "text-[var(--arena-text-muted)]"
                        }`} />
                      </div>

                      {/* Actions */}
                      <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1.5 hover:bg-[var(--arena-card)] rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4 text-[var(--arena-text-muted)]" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1.5 hover:bg-[var(--arena-card)] rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-[var(--arena-text-faint)] hover:text-red-500" />
                        </button>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
