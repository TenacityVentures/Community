import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
}

function pageHref(page: number) {
  return page === 1 ? '/' : `/page/${page}`
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null

  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  return (
    <nav
      className="flex items-center justify-between pt-12 mt-2 border-t border-[#37322f]/10"
      aria-label="Post pagination"
    >
      {/* Prev */}
      {hasPrev ? (
        <Link
          href={pageHref(currentPage - 1)}
          className="text-sm text-[#37322f]/50 hover:text-[#37322f] transition-colors"
          style={{ fontFamily: 'var(--font-serif), serif' }}
        >
          ← newer
        </Link>
      ) : (
        <span />
      )}

      {/* Page indicator */}
      <span
        className="text-xs text-[#37322f]/30 tabular-nums"
        aria-current="page"
      >
        {currentPage} / {totalPages}
      </span>

      {/* Next */}
      {hasNext ? (
        <Link
          href={pageHref(currentPage + 1)}
          className="text-sm text-[#37322f]/50 hover:text-[#37322f] transition-colors"
          style={{ fontFamily: 'var(--font-serif), serif' }}
        >
          older →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}
