import React from 'react';

import styles from './NotionCardList.module.css';

export function NotionCardSkeleton() {
  const skeletonCount = 10;

  return (
    <div
      className={styles['notion-gallery-grid']}
      aria-busy="true"
      aria-label="카드 리스트 로딩 중"
      role="status"
    >
      {Array.from({ length: skeletonCount }).map((_, i) => (
        <div
          key={i}
          className={styles['notion-collection-card']}
          style={{ pointerEvents: 'none' }}
          aria-hidden="true"
        >
          <div className={styles['notion-collection-card-cover']}>
            <div
              style={{
                width: '100%',
                aspectRatio: '16/10',
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'skeleton-loading 1.5s infinite linear',
              }}
            />
          </div>
          <div className={styles['notion-collection-card-body']}>
            <div
              className={styles['notion-collection-card-category']}
              style={{
                WebkitLineClamp: 1,
                lineClamp: 1,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  width: '80px',
                  height: '24px',
                  borderRadius: '16px',
                  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'skeleton-loading 1.5s infinite linear',
                }}
              />
              <div
                style={{
                  color: '#e0e0e0',
                  display: 'inline-block',
                  margin: '0 0.5rem',
                }}
              >
                |
              </div>
              <div
                style={{
                  display: 'inline-block',
                  width: '70px',
                  height: '20px',
                  borderRadius: '4px',
                  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'skeleton-loading 1.5s infinite linear',
                  verticalAlign: 'middle',
                }}
              />
            </div>
            <div
              style={{
                paddingRight: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <div
                className={styles['notion-collection-card-title']}
                style={{
                  width: '80%',
                  height: '24px',
                  borderRadius: '4px',
                  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'skeleton-loading 1.5s infinite linear',
                }}
              />
              <div
                className={styles['notion-collection-card-summary']}
                style={{
                  width: '95%',
                  height: '18px',
                  borderRadius: '4px',
                  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'skeleton-loading 1.5s infinite linear',
                }}
              />
              <div
                className={styles['notion-collection-card-summary']}
                style={{
                  width: '60%',
                  height: '18px',
                  borderRadius: '4px',
                  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'skeleton-loading 1.5s infinite linear',
                }}
              />
            </div>
          </div>
        </div>
      ))}
      <style>{`
        @keyframes skeleton-loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
