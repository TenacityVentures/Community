"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/supabase/auth-context"
import { ArenaHeader } from "@/components/arena/arena-header"
import { PostCard, PostCardSkeleton } from "@/components/arena/post-card"
import { motion } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import {
  ArrowLeft,
  Calendar,
  Link as LinkIcon,
  MapPin,
  Settings,
  Users,
  UserPlus,
  UserMinus,
  Loader2,
} from "lucide-react"
import type { Profile, PostWithAuthor } from "@/lib/supabase/types"

const roleLabels = {
  builder: { label: "Builder", bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-300" },
  partner: { label: "Partner", bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300" },
  learner: { label: "Learner", bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300" },
}

export default function ProfilePage() {
  const params = useParams()
  const username = params.username as string
  const { user, profile: currentUserProfile } = useAuth()
  const supabase = createClient()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [posts, setPosts] = useState<PostWithAuthor[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"posts" | "about">("posts")

  // Follow feature state
  const [isFollowing, setIsFollowing] = useState(false)
  const [followerCount, setFollowerCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [followLoading, setFollowLoading] = useState(false)

  const isOwnProfile = currentUserProfile?.username === username

  useEffect(() => {
    async function fetchProfile() {
      // Fetch profile
      const { data: profileData, error: profileError } = await (supabase
        .from("profiles") as any)
        .select("*")
        .eq("username", username)
        .single()

      if (profileError) {
        console.error("Error fetching profile:", profileError)
        setLoading(false)
        return
      }

      setProfile(profileData)

      // Fetch user's posts
      const { data: postsData } = await (supabase
        .from("posts") as any)
        .select(`
          *,
          author:profiles!posts_author_id_fkey(*)
        `)
        .eq("author_id", profileData.id)
        .eq("published", true)
        .order("created_at", { ascending: false })

      setPosts((postsData as PostWithAuthor[]) || [])

      // Fetch follower and following counts
      const [followerResult, followingResult] = await Promise.all([
        (supabase.from("follows") as any)
          .select("*", { count: "exact", head: true })
          .eq("following_id", profileData.id),
        (supabase.from("follows") as any)
          .select("*", { count: "exact", head: true })
          .eq("follower_id", profileData.id),
      ])

      setFollowerCount(followerResult.count || 0)
      setFollowingCount(followingResult.count || 0)

      setLoading(false)
    }

    fetchProfile()
  }, [username])

  // Check if current user is following this profile
  useEffect(() => {
    async function checkFollowStatus() {
      if (!user || !profile || isOwnProfile) return

      const { data } = await (supabase
        .from("follows") as any)
        .select("id")
        .eq("follower_id", user.id)
        .eq("following_id", profile.id)
        .single()

      setIsFollowing(!!data)
    }

    checkFollowStatus()
  }, [user, profile, isOwnProfile])

  const handleFollow = async () => {
    if (!user || !profile || followLoading) return

    setFollowLoading(true)

    try {
      if (isFollowing) {
        // Unfollow
        await (supabase.from("follows") as any)
          .delete()
          .eq("follower_id", user.id)
          .eq("following_id", profile.id)

        setIsFollowing(false)
        setFollowerCount((prev) => Math.max(0, prev - 1))
      } else {
        // Follow
        await (supabase.from("follows") as any).insert({
          follower_id: user.id,
          following_id: profile.id,
        })

        setIsFollowing(true)
        setFollowerCount((prev) => prev + 1)

        // Create notification for the followed user
        await (supabase.from("notifications") as any).insert({
          user_id: profile.id,
          actor_id: user.id,
          type: "follow",
        })
      }
    } catch (error) {
      console.error("Error toggling follow:", error)
    } finally {
      setFollowLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--arena-bg)]">
        <ArenaHeader />
        <main className="max-w-[800px] mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-[var(--arena-border)]" />
              <div className="space-y-2">
                <div className="h-8 w-48 bg-[var(--arena-border)] rounded" />
                <div className="h-4 w-32 bg-[var(--arena-border)] rounded" />
              </div>
            </div>
            <div className="space-y-4">
              <PostCardSkeleton />
              <PostCardSkeleton />
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[var(--arena-bg)]">
        <ArenaHeader />
        <main className="max-w-[800px] mx-auto px-4 py-16 text-center">
          <h1 className="font-instrument-serif text-3xl text-[var(--arena-text)] mb-4">User Not Found</h1>
          <p className="text-[var(--arena-text-muted)] mb-6">This user doesn't exist or has been removed.</p>
          <Link
            href="/arena"
            className="inline-flex items-center gap-2 text-[var(--arena-text)] hover:text-[var(--arena-text-muted)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to The Arena
          </Link>
        </main>
      </div>
    )
  }

  const role = roleLabels[profile.role]
  const joinedDate = formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })

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

          {/* Profile Header */}
          <div className="bg-[var(--arena-card)] rounded-2xl border border-[var(--arena-border)] p-6 sm:p-8 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[var(--arena-text)] text-[var(--arena-bg)] flex items-center justify-center text-3xl font-medium overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name || profile.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  (profile.full_name?.[0] || profile.username[0]).toUpperCase()
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                  <h1 className="font-instrument-serif text-2xl sm:text-3xl text-[var(--arena-text)]">
                    {profile.full_name || profile.username}
                  </h1>
                  <span className={`inline-flex self-center px-3 py-1 rounded-full text-xs font-medium ${role.bg} ${role.text}`}>
                    {role.label}
                  </span>
                </div>

                <p className="text-[var(--arena-text-muted)] mb-4">@{profile.username}</p>

                {profile.bio && (
                  <p className="text-[var(--arena-text)] mb-4 max-w-lg">{profile.bio}</p>
                )}

                {/* Meta Info */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-[var(--arena-text-muted)]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {joinedDate}
                  </span>
                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-[var(--arena-text)] transition-colors"
                    >
                      <LinkIcon className="w-4 h-4" />
                      Website
                    </a>
                  )}
                </div>

                {/* Skills */}
                {profile.skills && profile.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
                    {profile.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-[var(--arena-bg)] text-[var(--arena-text-muted)] text-sm rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 self-center sm:self-start">
                {isOwnProfile ? (
                  <Link
                    href="/arena/settings"
                    className="flex items-center gap-2 px-4 py-2 border border-[var(--arena-border)] rounded-lg text-sm text-[var(--arena-text-muted)] hover:border-[var(--arena-text)] hover:text-[var(--arena-text)] transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Edit Profile
                  </Link>
                ) : user ? (
                  <button
                    onClick={handleFollow}
                    disabled={followLoading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                      isFollowing
                        ? "border border-[var(--arena-border)] text-[var(--arena-text-muted)] hover:border-red-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        : "bg-[var(--arena-text)] text-[var(--arena-bg)] hover:opacity-90"
                    }`}
                  >
                    {followLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isFollowing ? (
                      <>
                        <UserMinus className="w-4 h-4" />
                        <span className="hidden sm:inline">Unfollow</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span className="hidden sm:inline">Follow</span>
                      </>
                    )}
                  </button>
                ) : (
                  <Link
                    href="/arena/login"
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--arena-text)] text-[var(--arena-bg)] rounded-lg text-sm font-medium hover:opacity-90 transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span className="hidden sm:inline">Follow</span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-[var(--arena-card)] rounded-xl border border-[var(--arena-border)] p-4 text-center">
              <p className="text-2xl font-semibold text-[var(--arena-text)]">{posts.length}</p>
              <p className="text-sm text-[var(--arena-text-muted)]">Posts</p>
            </div>
            <div className="bg-[var(--arena-card)] rounded-xl border border-[var(--arena-border)] p-4 text-center">
              <p className="text-2xl font-semibold text-[var(--arena-text)]">{followerCount}</p>
              <p className="text-sm text-[var(--arena-text-muted)]">Followers</p>
            </div>
            <div className="bg-[var(--arena-card)] rounded-xl border border-[var(--arena-border)] p-4 text-center">
              <p className="text-2xl font-semibold text-[var(--arena-text)]">{followingCount}</p>
              <p className="text-sm text-[var(--arena-text-muted)]">Following</p>
            </div>
            <div className="bg-[var(--arena-card)] rounded-xl border border-[var(--arena-border)] p-4 text-center">
              <p className="text-2xl font-semibold text-[var(--arena-text)]">
                {posts.reduce((acc, post) => acc + post.view_count, 0)}
              </p>
              <p className="text-sm text-[var(--arena-text-muted)]">Views</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-[var(--arena-border)] mb-6">
            <button
              onClick={() => setActiveTab("posts")}
              className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
                activeTab === "posts"
                  ? "text-[var(--arena-text)]"
                  : "text-[var(--arena-text-muted)] hover:text-[var(--arena-text)]"
              }`}
            >
              Posts
              {activeTab === "posts" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--arena-text)]"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
                activeTab === "about"
                  ? "text-[var(--arena-text)]"
                  : "text-[var(--arena-text-muted)] hover:text-[var(--arena-text)]"
              }`}
            >
              About
              {activeTab === "about" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--arena-text)]"
                />
              )}
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "posts" ? (
            posts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--arena-card)] flex items-center justify-center">
                  <span className="text-3xl">✍️</span>
                </div>
                <h3 className="font-instrument-serif text-xl text-[var(--arena-text)] mb-2">
                  {isOwnProfile ? "Share your first post" : "No posts yet"}
                </h3>
                <p className="text-[var(--arena-text-muted)] mb-4">
                  {isOwnProfile
                    ? "Start sharing your thoughts, ideas, and ventures with the community."
                    : "This user hasn't published any posts yet."}
                </p>
                {isOwnProfile && (
                  <Link
                    href="/arena/new"
                    className="inline-flex items-center gap-2 bg-[var(--arena-text)] text-[var(--arena-bg)] px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-colors"
                  >
                    Write Your First Post
                  </Link>
                )}
              </div>
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
            )
          ) : (
            <div className="bg-[var(--arena-card)] rounded-xl border border-[var(--arena-border)] p-6">
              <h3 className="font-instrument-serif text-xl text-[var(--arena-text)] mb-4">
                About {profile.full_name || profile.username}
              </h3>
              {profile.bio ? (
                <p className="text-[var(--arena-text)] whitespace-pre-wrap">{profile.bio}</p>
              ) : (
                <p className="text-[var(--arena-text-muted)] italic">No bio provided yet.</p>
              )}

              {profile.skills && profile.skills.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-[var(--arena-text)] mb-3">Skills & Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 bg-[var(--arena-bg)] text-[var(--arena-text)] text-sm rounded-lg"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {profile.website && (
                <div className="mt-6">
                  <h4 className="font-medium text-[var(--arena-text)] mb-2">Links</h4>
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[var(--arena-text)] hover:text-[var(--arena-text-muted)] transition-colors"
                  >
                    <LinkIcon className="w-4 h-4" />
                    {profile.website}
                  </a>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
