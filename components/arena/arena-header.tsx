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
} from "lucide-react"

const categories = [
  { slug: "building", label: "Building", icon: "🛠️" },
  { slug: "ideas", label: "Ideas", icon: "💡" },
  { slug: "stories", label: "Stories", icon: "📖" },
  { slug: "opportunities", label: "Opportunities", icon: "🤝" },
  { slug: "challenges", label: "Challenges", icon: "🎯" },
]

export function ArenaHeader() {
  const router = useRouter()
  const { user, profile, loading, signOut } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    setSigningOut(true)
    await signOut()
    setShowSignOutConfirm(false)
    setIsDropdownOpen(false)
    router.push("/arena")
  }

  return (
    <>
      <header className="w-full border-b border-[#37322f]/6 bg-[#f7f5f3] sticky top-0 z-40">
        <div className="max-w-[1060px] mx-auto px-4">
          <nav className="flex items-center justify-between py-4">
            {/* Left: Logo & Navigation */}
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-[#37322f] font-semibold text-lg">
                Tenacity
              </Link>
              <Link
                href="/arena"
                className="text-[#37322f] font-medium text-sm hover:text-[#37322f]/80 transition-colors"
              >
                The Arena
              </Link>
            </div>

            {/* Center: Categories (Desktop) */}
            <div className="hidden md:flex items-center space-x-1">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/arena?category=${cat.slug}`}
                  className="px-3 py-1.5 text-sm text-[#605A57] hover:text-[#37322f] hover:bg-[#37322f]/5 rounded-lg transition-all duration-200"
                >
                  <span className="mr-1.5">{cat.icon}</span>
                  {cat.label}
                </Link>
              ))}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-3">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-[#E0DEDB] animate-pulse" />
              ) : user ? (
                <>
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
                      className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#37322f]/5 transition-colors"
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
                      <ChevronDown className={`w-4 h-4 text-[#605A57] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
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

        {/* Mobile Categories */}
        <div className="md:hidden border-t border-[#37322f]/6 overflow-x-auto">
          <div className="flex items-center space-x-1 px-4 py-2">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/arena?category=${cat.slug}`}
                className="flex-shrink-0 px-3 py-1.5 text-sm text-[#605A57] hover:text-[#37322f] hover:bg-[#37322f]/5 rounded-lg transition-all duration-200 whitespace-nowrap"
              >
                <span className="mr-1">{cat.icon}</span>
                {cat.label}
              </Link>
            ))}
          </div>
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
