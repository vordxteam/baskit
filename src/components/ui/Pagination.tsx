'use client'

import React from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null

  const getPages = (): (number | '...')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (currentPage <= 4) return [1, 2, 3, 4, 5, '...', totalPages]
    if (currentPage >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
  }

  const pages = getPages()

  return (
    <div className="flex items-center justify-center mt-12 select-none" style={{ gap: '8px' }}>

      {/* Prev Arrow */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center disabled:opacity-30 transition-colors duration-150"
        style={{ padding: '10px 16.5px', color: '#25252599' }}
        aria-label="Previous page"
      >
        <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
          <path d="M6 1L1 6L6 11" stroke="#25252599" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Page Buttons */}
      {pages.map((page, i) =>
        page === '...' ? (
          <span
            key={`dots-${i}`}
            className="flex items-center justify-center text-[14px] font-normal"
            style={{ padding: '10px 16.5px', color: '#25252599' }}
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className="flex items-center justify-center text-[14px] font-normal border transition-all duration-150"
            style={{
              padding: '10px 16.5px',
              borderColor: '#25252533',
              backgroundColor: currentPage === page ? '#252525' : '',
              color: currentPage === page ? '#FFFFFF' : '#25252599',
            }}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        )
      )}

      {/* Next Arrow */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center disabled:opacity-30 transition-colors duration-150"
        style={{ padding: '10px 16.5px', color: '#25252599' }}
        aria-label="Next page"
      >
        <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
          <path d="M1 1L6 6L1 11" stroke="#25252599" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

    </div>
  )
}

export default Pagination