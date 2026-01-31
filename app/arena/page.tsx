import { Suspense } from "react"
import { ArenaHeader } from "@/components/arena/arena-header"
import { ArenaContent } from "@/components/arena/arena-content"
import { PostCardSkeleton } from "@/components/arena/post-card"
import Link from "next/link"

function ArenaContentFallback() {
  return (
    <>
      {/* Hero Section Skeleton */}
      <div className="text-center mb-10">
        <h1 className="font-instrument-serif text-4xl sm:text-5xl text-[var(--arena-text)] mb-3">
          The Arena
        </h1>
        <p className="text-[var(--arena-text-muted)] max-w-xl mx-auto">
          Where builders share ideas, discuss ventures, and forge connections.
          Step in, speak up, and grow together.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Skeleton */}
        <aside className="hidden lg:block lg:w-56 flex-shrink-0">
          <div className="lg:sticky lg:top-24">
            <h3 className="text-xs font-semibold text-[var(--arena-text-muted)] uppercase tracking-wider mb-3 px-3">
              Categories
            </h3>
            <nav className="space-y-1">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-9 bg-[var(--arena-text)]/5 rounded-lg animate-pulse"
                />
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content Skeleton */}
        <div className="flex-1 min-w-0">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default function ArenaPage() {
  return (
    <div className="min-h-screen bg-[var(--arena-bg)]">
      <ArenaHeader />

      <main className="max-w-[1060px] mx-auto px-4 py-8">
        <Suspense fallback={<ArenaContentFallback />}>
          <ArenaContent />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--arena-border)] mt-16">
        <div className="max-w-[1060px] mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[var(--arena-text-muted)]">
              © {new Date().getFullYear()} Tenacity. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-[var(--arena-text-muted)]">
              <Link href="/" className="hover:text-[var(--arena-text)] transition-colors">
                Home
              </Link>
              <Link href="/manifesto" className="hover:text-[var(--arena-text)] transition-colors">
                Manifesto
              </Link>
              <Link href="/arena" className="hover:text-[var(--arena-text)] transition-colors">
                The Arena
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
