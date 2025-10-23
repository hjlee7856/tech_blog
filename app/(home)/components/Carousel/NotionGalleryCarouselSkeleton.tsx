import styles from './NotionGalleryCarousel.module.css';

/**
 * NotionGalleryCarouselSkeleton
 * - 캐러셀의 카드 레이아웃과 동일하게 shimmer 효과로 스켈레톤 표시
 * - 반응형, 접근성, 최신 스타일 적용
 */
export function NotionGalleryCarouselSkeleton() {
  // 캐러셀에서 보여줄 카드 개수 (반응형 고려, 기본 3)
  const skeletonCount = 1;
  return (
    <section
      className={styles.carouselContainer}
      aria-busy="true"
      aria-label="캐러셀 스켈레톤"
      role="status"
      style={{
        position: 'relative',
        width: '100%',
        height: '75vh',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          gap: 24,
          overflowX: 'auto',
          background: '#e0e0e0',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 20,
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            minWidth: 260,
            maxWidth: 440,
          }}
          aria-hidden="true"
        >
          {/* 이미지 영역 */}
          <div
            style={{
              width: '100%',
              height: '65%',
              backgroundSize: '200% 100%',
              animation: 'skeleton-loading 1.2s infinite linear',
            }}
          />
          {/* 오버레이 텍스트 영역 */}
          <div
            className={styles.overlay}
            style={{
              width: '100%',
              minHeight: 120,
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 18,
            }}
          >
            {/* 카테고리 */}
            <div
              className={styles.category}
              style={{
                width: 100,
                height: 26,
                borderRadius: 22,
                background: 'linear-gradient(90deg, #e3e3e3 25%, #f5f5f5 50%, #e3e3e3 75%)',
                backgroundSize: '200% 100%',
                animation: 'skeleton-loading 1.2s infinite linear',
                color: 'transparent',
                marginBottom: 18,
              }}
            >
              &nbsp;
            </div>
            {/* 타이틀 */}
            <div
              className={styles.title}
              style={{
                width: '65%',
                height: 36,
                borderRadius: 8,
                background: 'linear-gradient(90deg, #e3e3e3 25%, #f5f5f5 50%, #e3e3e3 75%)',
                backgroundSize: '200% 100%',
                animation: 'skeleton-loading 1.2s infinite linear',
                color: 'transparent',
                marginBottom: 12,
              }}
            >
              &nbsp;
            </div>
            {/* 서브타이틀 */}
            <div
              className={styles.subtitle}
              style={{
                width: '85%',
                height: 24,
                borderRadius: 8,
                background: 'linear-gradient(90deg, #e3e3e3 25%, #f5f5f5 50%, #e3e3e3 75%)',
                backgroundSize: '200% 100%',
                animation: 'skeleton-loading 1.2s infinite linear',
                color: 'transparent',
              }}
            >
              &nbsp;
            </div>
          </div>
        </div>
      </div>
      {/* 페이지네이션 점 스켈레톤 */}
      <div className={styles.pagination} aria-hidden="true">
        {Array.from({ length: skeletonCount }).map((_, idx) => (
          <div
            key={idx}
            className={styles.dot}
            style={{
              background: '#e0e0e0',
              opacity: 0.5,
              width: 10,
              height: 10,
              borderRadius: '50%',
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes skeleton-loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </section>
  );
}
