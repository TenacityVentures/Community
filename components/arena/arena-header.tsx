"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/supabase/auth-context"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  User,
  LogOut,
  Settings,
  PenSquare,
  ChevronDown,
  Bookmark,
  Loader2,
  Bell,
  FileText,
  Sun,
  Moon,
  Heart,
  MessageCircle,
  UserPlus,
  AtSign,
  Check,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { formatDistanceToNow } from "date-fns"
import { useTheme } from "@/lib/theme-context"

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

export function ArenaHeader() {
  const router = useRouter()
  const { user, profile, loading, signOut } = useAuth()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const supabase = createClient()

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loadingNotifications, setLoadingNotifications] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Fetch notifications
  useEffect(() => {
    async function fetchNotifications() {
      if (!user) return

      setLoadingNotifications(true)

      const { data, error } = await (supabase
        .from("notifications") as any)
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
        .limit(20)

      if (!error && data) {
        setNotifications(data)
        setUnreadCount(data.filter((n: Notification) => !n.read).length)
      }

      setLoadingNotifications(false)
    }

    fetchNotifications()

    // Subscribe to new notifications
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user?.id}`,
        },
        () => {
          fetchNotifications()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const markAsRead = async (notificationId: string) => {
    await (supabase.from("notifications") as any)
      .update({ read: true })
      .eq("id", notificationId)

    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const markAllAsRead = async () => {
    if (!user) return

    await (supabase.from("notifications") as any)
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false)

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const handleSignOut = async () => {
    setSigningOut(true)
    await signOut()
    setShowSignOutConfirm(false)
    setIsDropdownOpen(false)
    router.push("/arena")
  }

  return (
    <>
      <header className="w-full border-b border-[#37322f]/6 bg-[#f7f5f3]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-[1060px] mx-auto px-4">
          <nav className="flex items-center justify-between h-14">
            {/* Left: Logo & Navigation */}
            <div className="flex items-center gap-6">
              <Link href="/" className="text-[#37322f] font-semibold text-lg">
                Tenacity
              </Link>
              <div className="hidden sm:flex items-center gap-1">
                <Link
                  href="/arena"
                  className="px-3 py-1.5 text-sm font-medium text-[#37322f] hover:bg-[#37322f]/5 rounded-lg transition-colors"
                >
                  The Arena
                </Link>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-[#E0DEDB] animate-pulse" />
              ) : user ? (
                <>
                  {/* Theme Toggle */}
                  <button
                    onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                    className="p-2 text-[#605A57] hover:text-[#37322f] hover:bg-[#37322f]/5 dark:text-[#a8a5a0] dark:hover:text-[#f5f3f1] dark:hover:bg-white/5 rounded-lg transition-colors"
                    title={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                  >
                    {resolvedTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>

                  {/* Notifications Dropdown */}
                  <div className="relative" ref={notificationsRef}>
                    <button
                      onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                      className="p-2 text-[#605A57] hover:text-[#37322f] hover:bg-[#37322f]/5 dark:text-[#a8a5a0] dark:hover:text-[#f5f3f1] dark:hover:bg-white/5 rounded-lg transition-colors relative"
                      title="Notifications"
                    >
                      <Bell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </button>

                    <AnimatePresence>
                      {isNotificationsOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-[#E0DEDB]/60 overflow-hidden"
                        >
                          {/* Header */}
                          <div className="px-4 py-3 border-b border-[#E0DEDB]/60 flex items-center justify-between">
                            <h3 className="font-medium text-[#37322f] text-sm">Notifications</h3>
                            {unreadCount > 0 && (
                              <button
                                onClick={markAllAsRead}
                                className="text-xs text-[#605A57] hover:text-[#37322f] flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" />
                                Mark all read
                              </button>
                            )}
                          </div>

                          {/* Notifications List */}
                          <div className="max-h-80 overflow-y-auto">
                            {loadingNotifications ? (
                              <div className="py-8 flex items-center justify-center">
                                <Loader2 className="w-5 h-5 animate-spin text-[#9C9894]" />
                              </div>
                            ) : notifications.length === 0 ? (
                              <div className="py-8 text-center">
                                <Bell className="w-8 h-8 text-[#E0DEDB] mx-auto mb-2" />
                                <p className="text-sm text-[#9C9894]">No notifications yet</p>
                              </div>
                            ) : (
                              notifications.map((notification) => {
                                const Icon = notificationIcons[notification.type]
                                const message = notificationMessages[notification.type]

                                return (
                                  <Link
                                    key={notification.id}
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
                                      setIsNotificationsOpen(false)
                                    }}
                                    className={`flex items-start gap-3 px-4 py-3 hover:bg-[#f7f5f3] transition-colors ${
                                      !notification.read ? "bg-blue-50/50" : ""
                                    }`}
                                  >
                                    {/* Actor Avatar */}
                                    <div className="w-8 h-8 rounded-full bg-[#37322f] text-white flex items-center justify-center text-xs font-medium overflow-hidden flex-shrink-0">
                                      {notification.actor.avatar_url ? (
                                        <img
                                          src={notification.actor.avatar_url}
                                          alt={notification.actor.username}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        (notification.actor.full_name?.[0] || notification.actor.username[0]).toUpperCase()
                                      )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm text-[#37322f]">
                                        <span className="font-medium">
                                          {notification.actor.full_name || notification.actor.username}
                                        </span>{" "}
                                        {message}
                                        {notification.post && (
                                          <span className="text-[#605A57]">
                                            : {notification.post.title.slice(0, 30)}
                                            {notification.post.title.length > 30 ? "..." : ""}
                                          </span>
                                        )}
                                      </p>
                                      <p className="text-xs text-[#9C9894] mt-0.5">
                                        {formatDistanceToNow(new Date(notification.created_at), {
                                          addSuffix: true,
                                        })}
                                      </p>
                                    </div>

                                    {/* Icon */}
                                    <div className="flex-shrink-0">
                                      <Icon className={`w-4 h-4 ${
                                        notification.type === "follow" ? "text-blue-500" :
                                        notification.type === "reaction" ? "text-red-500" :
                                        "text-[#9C9894]"
                                      }`} />
                                    </div>
                                  </Link>
                                )
                              })
                            )}
                          </div>

                          {/* Footer */}
                          {notifications.length > 0 && (
                            <div className="border-t border-[#E0DEDB]/60 p-2">
                              <Link
                                href="/arena/notifications"
                                onClick={() => setIsNotificationsOpen(false)}
                                className="block text-center text-sm text-[#605A57] hover:text-[#37322f] py-2 rounded-lg hover:bg-[#f7f5f3] transition-colors"
                              >
                                View all notifications
                              </Link>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* New Post Button */}
                  <Link
                    href="/arena/new"
                    className="hidden sm:flex items-center gap-2 bg-[#37322F] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4a443f] transition-colors"
                  >
                    <PenSquare className="w-4 h-4" />
                    New Post
                  </Link>

                  {/* Mobile New Post */}
                  <Link
                    href="/arena/new"
                    className="sm:hidden p-2 bg-[#37322F] text-white rounded-lg hover:bg-[#4a443f] transition-colors"
                  >
                    <PenSquare className="w-4 h-4" />
                  </Link>

                  {/* User Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-[#37322f]/5 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#37322f] to-[#5a524d] text-white flex items-center justify-center text-sm font-medium overflow-hidden ring-2 ring-white">
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
                      <ChevronDown className={`w-3.5 h-3.5 text-[#605A57] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#E0DEDB]/60 overflow-hidden"
                        >
                          {/* User Info */}
                          <div className="px-4 py-3 border-b border-[#E0DEDB]/60">
                            <p className="font-medium text-[#37322f] truncate text-sm">
                              {profile?.full_name || profile?.username}
                            </p>
                            <p className="text-xs text-[#9C9894] truncate">
                              @{profile?.username}
                            </p>
                          </div>

                          {/* Menu Items */}
                          <div className="py-1">
                            <Link
                              href={`/arena/profile/${profile?.username}`}
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#37322f] hover:bg-[#f7f5f3] transition-colors"
                            >
                              <User className="w-4 h-4 text-[#9C9894]" />
                              Your Profile
                            </Link>
                            <Link
                              href={`/arena/profile/${profile?.username}?tab=posts`}
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#37322f] hover:bg-[#f7f5f3] transition-colors"
                            >
                              <FileText className="w-4 h-4 text-[#9C9894]" />
                              Your Posts
                            </Link>
                            <Link
                              href="/arena/bookmarks"
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#37322f] hover:bg-[#f7f5f3] transition-colors"
                            >
                              <Bookmark className="w-4 h-4 text-[#9C9894]" />
                              Bookmarks
                            </Link>
                            <Link
                              href="/arena/settings"
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#37322f] hover:bg-[#f7f5f3] transition-colors"
                            >
                              <Settings className="w-4 h-4 text-[#9C9894]" />
                              Settings
                            </Link>
                          </div>

                          {/* Sign Out */}
                          <div className="border-t border-[#E0DEDB]/60 py-1">
                            <button
                              onClick={() => {
                                setIsDropdownOpen(false)
                                setShowSignOutConfirm(true)
                              }}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full transition-colors"
                            >
                              <LogOut className="w-4 h-4" />
                              Sign Out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <Link
                  href="/arena/login"
                  className="bg-[#37322F] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4a443f] transition-colors"
                >
                  Enter The Arena
                </Link>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Sign Out Confirmation Modal */}
      <AnimatePresence>
        {showSignOutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => !signingOut && setShowSignOutConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-medium text-[#37322f]">Sign out?</h3>
                  <p className="text-xs text-[#9C9894]">You can always sign back in</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSignOutConfirm(false)}
                  disabled={signingOut}
                  className="flex-1 px-4 py-2.5 text-sm text-[#37322f] hover:bg-[#f7f5f3] rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                >
                  {signingOut ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Signing out...
                    </>
                  ) : (
                    'Sign Out'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
