import { createClient } from "@/lib/supabase/server"
import type { Metadata } from "next"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://10na.city'

interface Props {
  params: Promise<{ slug: string }>
  children: React.ReactNode
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await (supabase
    .from("posts") as any)
    .select(`
      *,
      author:profiles!posts_author_id_fkey(full_name, username)
    `)
    .eq("slug", slug)
    .single()

  if (!post) {
    return {
      title: "Post Not Found | The Arena",
      description: "This post doesn't exist or has been removed.",
    }
  }

  const authorName = post.author?.full_name || post.author?.username || 'Anonymous'
  const description = post.excerpt || `A post by ${authorName} in The Arena`

  return {
    title: `${post.title} | The Arena`,
    description,
    authors: [{ name: authorName }],
    openGraph: {
      title: post.title,
      description,
      url: `${SITE_URL}/arena/post/${slug}`,
      siteName: "Tenacity",
      images: [
        {
          url: `${SITE_URL}/arena-og.png`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: "en_US",
      type: "article",
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
      authors: [authorName],
      tags: post.tags || [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [`${SITE_URL}/arena-og.png`],
    },
    alternates: {
      canonical: `${SITE_URL}/arena/post/${slug}`,
    },
  }
}

export default function PostLayout({ children }: { children: React.ReactNode }) {
  return children
}
