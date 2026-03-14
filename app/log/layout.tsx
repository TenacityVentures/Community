import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Log — 10na.city',
  description: 'Essays, resources, and bold tenacity content from the 10na.city community.',
}

export default function LogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f5f3]" style={{ fontFamily: 'var(--font-serif), serif' }}>
      <header className="border-b border-[#37322f]/10 px-6 py-5">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link
            href="/log"
            className="text-[#37322f] font-semibold text-lg tracking-tight hover:opacity-70 transition-opacity"
          >
            log.
          </Link>
          <Link
            href="/"
            className="text-[#37322f]/50 text-sm hover:text-[#37322f] transition-colors"
          >
            10na.city →
          </Link>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
