import { useRouter } from 'next/navigation'
import React from 'react'

import { Overlay, Content, Category, Title, Subtitle } from './PostOverlay.styles'

interface PostOverlayProps {
  title: string
  subtitle?: string
  category?: string
  className?: string
}

/**
 * 화면 중앙에 제목, 부제목, 카테고리를 오버레이로 표시하는 컴포넌트
 * - width: 100%, height: 부모에서 제어
 * - 배경은 투명/반투명, 내용은 세로 중앙 정렬
 */
export function PostOverlay({ title, subtitle, category, className }: PostOverlayProps) {
  const router = useRouter()

  const handleCategoryClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (category) {
      void router.push(`/?category=${encodeURIComponent(category)}`)
    }
  }

  return (
    <Overlay
      className={className}
      aria-modal="true"
      role="dialog"
    >
      <Content>
        {category && (
          <Category
            type="button"
            onClick={handleCategoryClick}
            tabIndex={0}
            aria-label={`카테고리 ${category}로 이동`}
          >
            {category}
          </Category>
        )}
        <Title>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </Content>
    </Overlay>
  )
}
