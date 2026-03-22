import { getAllPosts, getTotalPages } from '@/lib/posts'
import { SearchablePosts } from '@/components/log/searchable-posts'
import { Pagination } from '@/components/log/pagination'

export default function HomePage() {
  const allPosts   = getAllPosts()
  const posts      = allPosts.slice(0, 10)
  const totalPages = getTotalPages()

  return (
    <div
      className="max-w-2xl mx-auto px-6 py-16"
      style={{ fontFamily: 'var(--font-serif), serif' }}
    >
      <div className="mb-14">
        <h1 className="text-4xl text-[#37322f] mb-3">The Log</h1>
        <p className="text-[#37322f]/60 text-lg">Thinking out loud. Building in public.</p>
      </div>

      {/*
        SEARCH: change searchEnabled={false} → searchEnabled={true} to turn on.
        When active, search covers ALL posts across all pages.
      */}
      <SearchablePosts posts={posts} allPosts={allPosts} searchEnabled={false} />
      <Pagination currentPage={1} totalPages={totalPages} />
    </div>
  )
}
