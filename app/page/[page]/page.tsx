import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllPosts, getPostsPage, getTotalPages } from '@/lib/posts'
import { SearchablePosts } from '@/components/log/searchable-posts'
import { Pagination } from '@/components/log/pagination'

interface Props {
  params: { page: string }
}

// Pre-render every page at build time
export async function generateStaticParams() {
  const total = getTotalPages()
  // page 1 is handled by app/page.tsx — only generate 2+
  return Array.from({ length: Math.max(0, total - 1) }, (_, i) => ({
    page: String(i + 2),
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = Number(params.page)
  return {
    title: `The Log — Page ${page}`,
    description: `Thinking out loud. Building in public. Page ${page}.`,
    alternates: {
      canonical: `https://log.10na.city/page/${page}`,
    },
  }
}

export default function PaginatedPage({ params }: Props) {
  const page       = Number(params.page)
  const totalPages = getTotalPages()

  // Redirect to 404 for invalid page numbers
  if (isNaN(page) || page < 2 || page > totalPages) notFound()

  const allPosts = getAllPosts()
  const posts    = getPostsPage(page)

  return (
    <div
      className="max-w-2xl mx-auto px-6 py-16"
      style={{ fontFamily: 'var(--font-serif), serif' }}
    >
      <div className="mb-14">
        <h1 className="text-4xl text-[#37322f] mb-3">The Log</h1>
        <p className="text-[#37322f]/60 text-lg">Thinking out loud. Building in public.</p>
      </div>

      <SearchablePosts posts={posts} allPosts={allPosts} searchEnabled={false} />
      <Pagination currentPage={page} totalPages={totalPages} />
    </div>
  )
}
