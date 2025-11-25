import 'swiper/css'
import 'swiper/css/navigation'

import Image from 'next/image'
import { useMemo, useRef, useState } from 'react'
import type { Swiper as SwiperInstance } from 'swiper'
import { Autoplay, Keyboard, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import type { NotionPage } from '@/lib/notion-page'

import {
  ArrowContainer,
  ArrowLeft,
  ArrowRight,
  Category,
  Container,
  Dot,
  DotActive,
  ImageCoverOverlay,
  Overlay,
  OverlayContent,
  Pagination,
  Subtitle,
  Title,
} from './NotionGalleryCarousel.styles'
import { NotionGalleryCarouselSkeleton } from './NotionGalleryCarouselSkeleton'

export function NotionGalleryCarousel({
  pages,
  skeleton = false,
}: {
  pages?: NotionPage[];
  skeleton?: boolean;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const swiperRef = useRef<SwiperInstance | null>(null);

  // 모든 hook은 조건 없이 컴포넌트 최상단에서 선언
  const items = useMemo(() => (Array.isArray(pages) ? pages : []), [pages]);
  const filteredItems = useMemo(() => items.filter((item) => item.cover), [items]);

  // 스켈레톤 분기: 로딩 중이거나 pages가 undefined/빈 배열이면 스켈레톤 표시
  if (skeleton || !pages || pages.length === 0) {
    return <NotionGalleryCarouselSkeleton />;
  }

  if (!filteredItems.length) {
    return (
      <div style={{ padding: 16, textAlign: 'center', color: '#666' }}>표시할 항목이 없습니다.</div>
    );
  }

  return (
    <Container aria-label="Notion 페이지 캐로셀">
      <Swiper
        autoplay={{ delay: 5000 }}
        modules={[Navigation, Keyboard, Autoplay]}
        slidesPerView={1}
        spaceBetween={0}
        onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex % filteredItems.length)}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        navigation={false}
        keyboard={{ enabled: true }}
        style={{ width: '100%', height: '100%' }}
        loop={true}
      >
        {filteredItems.map((item) => (
          <SwiperSlide key={item.id}>
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              {item.cover ? (
                <>
                  <Image
                    src={`${item.cover}`}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', backgroundColor: '#222', zIndex: 0 }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                    fill
                  />
                  <ImageCoverOverlay />
                </>
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#999',
                    fontSize: 18,
                    backgroundColor: '#222',
                  }}
                >
                  이미지 없음
                </div>
              )}
              <Overlay href={`/post/${item.id}`}>
                <OverlayContent>
                  {item.category && <Category>{item.category}</Category>}
                  <Title>{item.title}</Title>
                  {item.subtitle && <Subtitle>{item.subtitle}</Subtitle>}
                </OverlayContent>
              </Overlay>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <ArrowContainer>
        <ArrowLeft
          aria-label="이전 슬라이드"
          onClick={() => swiperRef.current?.slidePrev()}
          tabIndex={0}
          type="button"
        >
          <Image src="/carousel-left.png" alt="이전 슬라이드" width={64} height={64} />
        </ArrowLeft>
        <ArrowRight
          aria-label="다음 슬라이드"
          onClick={() => swiperRef.current?.slideNext()}
          tabIndex={0}
          type="button"
        >
          <Image src="/carousel-right.png" alt="다음 슬라이드" width={64} height={64} />
        </ArrowRight>
      </ArrowContainer>
      <Pagination>
        {filteredItems.map((_, idx) => (
          idx === currentIndex ? (
            <DotActive
              key={idx}
              aria-label={`페이지 ${idx + 1}`}
              tabIndex={-1}
              role="button"
              onClick={() => {
                setCurrentIndex(idx)
                swiperRef.current?.slideToLoop(idx)
              }}
            />
          ) : (
            <Dot
              key={idx}
              aria-label={`페이지 ${idx + 1}`}
              tabIndex={-1}
              role="button"
              onClick={() => {
                setCurrentIndex(idx)
                swiperRef.current?.slideToLoop(idx)
              }}
            />
          )
        ))}
      </Pagination>
    </Container>
  )
}
