"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<'google' | 'github' | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const supabase = createClient()

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/arena/auth/callback`,
      },
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Check your email for the magic link!' })
    }
    setLoading(false)
  }

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setOauthLoading(provider)
    setMessage(null)

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/arena/auth/callback`,
      },
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
      setOauthLoading(null)
    }
    // Don't reset loading here - we're redirecting to OAuth provider
  }

  const isDisabled = loading || oauthLoading !== null

  return (
    <div className="min-h-screen bg-[#f7f5f3] flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-[#37322f]/6">
        <div className="max-w-[1060px] mx-auto px-4">
          <nav className="flex items-center justify-between py-4">
            <Link href="/" className="text-[#37322f] font-semibold text-lg">
              Tenacity
            </Link>
            <Link
              href="/arena"
              className="text-[#37322f] hover:text-[#37322f]/80 text-sm font-medium"
            >
              Back to Arena
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Decorative lines */}
          <div className="relative">
            <div className="absolute -left-4 top-0 bottom-0 w-px bg-[#37322f]/10" />
            <div className="absolute -right-4 top-0 bottom-0 w-px bg-[#37322f]/10" />

            <div className="bg-white rounded-2xl shadow-lg border border-[#37322f]/5 p-8 sm:p-10">
              <div className="text-center mb-8">
                <h1 className="font-instrument-serif text-3xl sm:text-4xl text-[#37322f] mb-2">
                  Enter The Arena
                </h1>
                <p className="text-[#605A57] text-sm">
                  Join the community of builders, thinkers, and doers.
                </p>
              </div>

              {/* OAuth Buttons */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => handleOAuthLogin('google')}
                  disabled={isDisabled}
                  className="w-full flex items-center justify-center gap-3 border-2 border-[#E0DEDB] rounded-lg px-4 py-3 text-[#37322f] font-medium hover:border-[#37322f] hover:bg-[#f7f5f3] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {oauthLoading === 'google' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  )}
                  {oauthLoading === 'google' ? 'Connecting...' : 'Continue with Google'}
                </button>

                <button
                  onClick={() => handleOAuthLogin('github')}
                  disabled={isDisabled}
                  className="w-full flex items-center justify-center gap-3 border-2 border-[#E0DEDB] rounded-lg px-4 py-3 text-[#37322f] font-medium hover:border-[#37322f] hover:bg-[#f7f5f3] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {oauthLoading === 'github' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  )}
                  {oauthLoading === 'github' ? 'Connecting...' : 'Continue with GitHub'}
                </button>
              </div>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E0DEDB]" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-[#605A57]">or continue with email</span>
                </div>
              </div>

              {/* Magic Link Form */}
              <form onSubmit={handleMagicLink} className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isDisabled}
                  className="w-full border-2 border-[#E0DEDB] rounded-lg px-4 py-3 focus:outline-none focus:border-[#37322f] text-[#37322f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
                <button
                  type="submit"
                  disabled={isDisabled || !email}
                  className="w-full bg-[#37322F] text-white rounded-lg px-4 py-3 font-medium hover:bg-[#4a443f] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? "Sending..." : "Send Magic Link"}
                </button>
              </form>

              {/* Message */}
              <AnimatePresence>
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`mt-4 p-3 rounded-lg text-sm text-center ${
                      message.type === 'success'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {message.text}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer */}
              <p className="mt-6 text-center text-xs text-[#605A57]">
                By continuing, you agree to join a community that values
                <br />
                <span className="font-medium text-[#37322f]">courage, creativity, and execution.</span>
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
