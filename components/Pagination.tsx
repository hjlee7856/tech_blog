import React, { useEffect, useState } from 'react'

import { ArrowIcon } from './icons/ArrowIcon'
import { DoubleArrowIcon } from './icons/DoubleArrowIcon'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const baseButtonStyle = (
  disabled: boolean,
  bold?: boolean,
  active?: boolean
): React.CSSProperties => ({
  padding: '4px 10px',
  borderRadius: 6,
  border: active ? '2px solid #222' : 'none',
  background: active ? '#303030' : '#f2f3f6',
  fontWeight: bold || active ? 700 : 400,
  cursor: disabled || active ? 'not-allowed' : 'pointer',
  color: active ? '#fff' : '#868b94',
  fontSize: 15,
  outline: 'none',
  margin: '2px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
})

export function Pagination({
  currentPage,
  totalPages,
  onPageChange
}: PaginationProps) {
  const [pageGroupSize, setPageGroupSize] = useState(10)
  const iconSize = 15

  // 화면 크기에 따라 pageGroupSize
  useEffect(() => {
    const updateResponsive = () => {
      if (window.innerWidth <= 768) {
        setPageGroupSize(5)
      } else {
        setPageGroupSize(10)
      }
    }
    updateResponsive()
    window.addEventListener('resize', updateResponsive)
    return () => window.removeEventListener('resize', updateResponsive)
  }, [])

  const currentGroup = Math.floor((currentPage - 1) / pageGroupSize)
  const startPage = currentGroup * pageGroupSize + 1
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages)

  const createPageNumbers = () => {
    const pages = []
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <nav
      aria-label='페이지네이션'
      style={{
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
        margin: '2rem 0',
        boxSizing: 'border-box',
        maxWidth: '100%'
      }}
    >
      <button
        type='button'
        onClick={() => onPageChange(startPage - 1)}
        disabled={startPage === 1}
        aria-label={`이전 ${pageGroupSize}페이지`}
        style={baseButtonStyle(startPage === 1, true)}
      >
        <DoubleArrowIcon direction='left' size={iconSize} />
      </button>
      <button
        type='button'
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label='이전 페이지'
        style={baseButtonStyle(currentPage === 1)}
      >
        <ArrowIcon direction='left' size={iconSize} />
      </button>

      {createPageNumbers().map((num) => (
        <button
          key={num}
          type='button'
          onClick={() => onPageChange(num)}
          disabled={num === currentPage}
          aria-current={num === currentPage ? 'page' : undefined}
          style={baseButtonStyle(
            num === currentPage,
            false,
            num === currentPage
          )}
        >
          {num}
        </button>
      ))}

      <button
        type='button'
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label='다음 페이지'
        style={baseButtonStyle(currentPage === totalPages)}
      >
        <ArrowIcon direction='right' size={iconSize} />
      </button>
      <button
        type='button'
        onClick={() => onPageChange(endPage + 1)}
        disabled={endPage === totalPages}
        aria-label={`다음 ${pageGroupSize}페이지`}
        style={baseButtonStyle(endPage === totalPages, true)}
      >
        <DoubleArrowIcon direction='right' size={iconSize} />
      </button>
    </nav>
  )
}
