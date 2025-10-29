import Image from 'next/image'

import { Root, ImageWrapper, Overlay } from './NotionFooterCard.styles'

export interface NotionFooterCardProps {
  className?: string
}

export function NotionFooterCard({ className }: NotionFooterCardProps) {
  return (
    <Root className={className} aria-label="데일리언 푸터 배너">
      <ImageWrapper>
        <Image
          src="/post-footer.png"
          alt="데일리언 푸터 배경"
          fill
          style={{ objectFit: 'cover' }}
          priority
          sizes="(max-width: 600px) 100vw, 900px"
        />
        <Overlay aria-hidden="true" />
      </ImageWrapper>
    </Root>
  )
}
