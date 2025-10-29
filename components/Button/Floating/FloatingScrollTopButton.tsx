'use client'
import { useCallback, useEffect, useState } from 'react'
import { FiArrowUp } from 'react-icons/fi'

import { ScrollTopButton } from './FloatingScrollTopButton.styles'

export interface FloatingScrollTopButtonProps {
  threshold?: number // 스크롤 표시 임계값(px)
  className?: string
}

/**
 * 화면 우측 하단에 떠 있다가, 스크롤이 일정 이상 내려가면 나타나는 '맨 위로' 버튼
 * - 크기: 24x24px, 색상: 흰색, 원형, 그림자, 접근성/반응형/키보드 지원
 */
export function FloatingScrollTopButton({
  threshold = 100,
  className = ''
}: FloatingScrollTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > threshold)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // 초기 상태
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  const handleClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  if (!isVisible) return null

  return (
    <ScrollTopButton
      type='button'
      aria-label='맨 위로 이동'
      onClick={handleClick}
      className={className}
    >
      <FiArrowUp size={24} color='#fff' aria-hidden />
    </ScrollTopButton>
  )
}
