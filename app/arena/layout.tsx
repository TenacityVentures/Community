import { AuthProvider } from "@/lib/supabase/auth-context"
import { ThemeProvider } from "@/lib/theme-context"
import type { Metadata } from "next"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://10na.city'

export const metadata: Metadata = {
  title: "The Arena | Tenacity",
  description: "Where builders share ideas, discuss ventures, and forge connections. Step in, speak up, and grow together.",
  openGraph: {
    title: "The Arena",
    description: "Where builders share ideas, discuss ventures, and forge connections. Step in, speak up, and grow together.",
    url: `${SITE_URL}/arena`,
    siteName: "Tenacity",
    images: [
      {
        url: `${SITE_URL}/arena-og.png`,
        width: 1200,
        height: 630,
        alt: "The Arena - A community for builders",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Arena | Tenacity",
    description: "Where builders share ideas, discuss ventures, and forge connections.",
    images: [`${SITE_URL}/arena-og.png`],
  },
  alternates: {
    canonical: `${SITE_URL}/arena`,
  },
}

export default function ArenaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  )
}
