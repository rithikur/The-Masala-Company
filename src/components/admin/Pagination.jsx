import React from 'react'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'

const Pagination = ({
  page = 1,
  totalPages = 1,
  onPageChange = () => {},
  perPage = 10,
  totalResults = 0,
}) => {
  if (totalPages <= 1) return null

  // Generate page numbers array (max 5 items, centered around current page)
  const getPageNumbers = () => {
    const pages = []
    const range = 2 // number of pages to show on each side of active page

    let start = Math.max(1, page - range)
    let end = Math.min(totalPages, page + range)

    if (page <= range) {
      end = Math.min(totalPages, range * 2 + 1)
    }
    if (page > totalPages - range) {
      start = Math.max(1, totalPages - range * 2)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return { pages, start, end }
  };

  const { pages, start, end } = getPageNumbers()

  // Calculate results range display: e.g. "Showing 11–20 of 42 results"
  const startResult = (page - 1) * perPage + 1
  const endResult = Math.min(page * perPage, totalResults)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 border-t border-cream-dark/60 bg-white">
      {/* Label */}
      <div className="text-sm font-body text-charcoal-muted">
        {totalResults > 0 ? (
          <>
            Showing <span className="font-semibold text-charcoal">{startResult}</span>–
            <span className="font-semibold text-charcoal">{endResult}</span> of{' '}
            <span className="font-semibold text-charcoal">{totalResults}</span> results
          </>
        ) : (
          `Page ${page} of ${totalPages}`
        )}
      </div>

      {/* Buttons */}
      <nav className="flex items-center space-x-1" aria-label="Pagination">
        {/* Prev */}
        <button
          onClick={() => page > 1 && onPageChange(page - 1)}
          disabled={page === 1}
          className="p-2 rounded-md border border-spice-brown/10 text-charcoal-muted hover:text-spice-brown hover:bg-cream disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <HiChevronLeft size={18} />
        </button>

        {/* First page + ellipsis if range doesn't include 1 */}
        {start > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className={[
                'px-3.5 py-1.5 rounded-md text-sm font-body font-medium transition-colors',
                page === 1
                  ? 'bg-turmeric text-cream'
                  : 'text-charcoal-soft hover:bg-cream hover:text-spice-brown',
              ].join(' ')}
            >
              1
            </button>
            {start > 2 && <span className="px-2 text-charcoal-muted text-sm">...</span>}
          </>
        )}

        {/* Dynamic page numbers */}
        {pages.map((p) => {
          const isActive = p === page
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              aria-current={isActive ? 'page' : undefined}
              className={[
                'px-3.5 py-1.5 rounded-md text-sm font-body font-medium transition-colors',
                isActive
                  ? 'bg-turmeric text-cream shadow-sm'
                  : 'text-charcoal-soft hover:bg-cream hover:text-spice-brown',
              ].join(' ')}
            >
              {p}
            </button>
          )
        })}

        {/* Last page + ellipsis if range doesn't include totalPages */}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="px-2 text-charcoal-muted text-sm">...</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              className={[
                'px-3.5 py-1.5 rounded-md text-sm font-body font-medium transition-colors',
                page === totalPages
                  ? 'bg-turmeric text-cream'
                  : 'text-charcoal-soft hover:bg-cream hover:text-spice-brown',
              ].join(' ')}
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next */}
        <button
          onClick={() => page < totalPages && onPageChange(page + 1)}
          disabled={page === totalPages}
          className="p-2 rounded-md border border-spice-brown/10 text-charcoal-muted hover:text-spice-brown hover:bg-cream disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <HiChevronRight size={18} />
        </button>
      </nav>
    </div>
  )
}

export default Pagination
