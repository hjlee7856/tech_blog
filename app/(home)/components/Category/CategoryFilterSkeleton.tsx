import { Button, Container } from './NotionCategoryFilter.styles'

const SKELETON_COUNT = 8
const SKELETON_GRADIENT = 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)'
const SKELETON_STYLE = {
  background: SKELETON_GRADIENT,
  backgroundSize: '200% 100%',
  animation: 'skeleton-loading 1.5s infinite linear',
}

export function CategoryFilterSkeleton() {
  return (
    <>
      <Container
        aria-busy="true"
        aria-label="카테고리 스켈레톤"
        role="status"
      >
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <Button
            key={i}
            disabled
            style={{
              ...SKELETON_STYLE,
              cursor: 'not-allowed',
              pointerEvents: 'none',
            }}
          />
        ))}
      </Container>
      <style>{`
        @keyframes skeleton-loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </>
  )
}
