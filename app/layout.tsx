import type React from 'react'
import type { Metadata } from 'next'
import { Crimson_Pro } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Link from 'next/link'
import './globals.css'

const crimsonPro = Crimson_Pro({
  subsets: ['latin'],
  variable: '--font-serif',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://log.10na.city'),
  title: {
    default: 'log.10na.city',
    template: '%s — log.10na.city',
  },
  description: 'Essays, resources, and bold tenacity content from the 10na.city community of builders.',
  keywords: ['founders', 'building', 'startups', 'africa', 'tenacity', 'ventures'],
  authors: [{ name: 'David Paul Conteh' }],
  creator: 'David Paul Conteh',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://log.10na.city',
    siteName: 'log.10na.city',
    title: 'log.10na.city',
    description: 'Essays, resources, and bold tenacity content from the 10na.city community of builders.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'log.10na.city',
    description: 'Essays, resources, and bold tenacity content from the 10na.city community of builders.',
  },
  alternates: {
    canonical: 'https://log.10na.city',
    types: {
      'application/rss+xml': 'https://log.10na.city/feed.xml',
    },
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/tenacitylogosmall.jpeg',
    apple: '/tenacitylogosmall.jpeg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${crimsonPro.variable} font-sans antialiased bg-[#f7f5f3]`}>
        <header className="border-b border-[#37322f]/10 px-6 py-5">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <Link
              href="/"
              className="text-[#37322f] font-semibold text-lg tracking-tight hover:opacity-70 transition-opacity"
              style={{ fontFamily: 'var(--font-serif), serif' }}
            >
              log.
            </Link>
            <div className="flex items-center gap-5">
              <Link
                href="/feed.xml"
                className="text-[#37322f]/40 text-xs hover:text-[#37322f] transition-colors"
                title="RSS Feed"
              >
                RSS
              </Link>
              <a
                href="https://10na.city"
                className="text-[#37322f]/50 text-sm hover:text-[#37322f] transition-colors"
                style={{ fontFamily: 'var(--font-serif), serif' }}
              >
                10na.city →
              </a>
            </div>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-[#37322f]/10 px-6 py-8 mt-20">
          <div className="max-w-2xl mx-auto flex items-center justify-between text-xs text-[#37322f]/40">
            <span style={{ fontFamily: 'var(--font-serif), serif' }}>log.10na.city</span>
            <a href="https://10na.city" className="hover:text-[#37322f] transition-colors">
              10na.city
            </a>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  )
}
