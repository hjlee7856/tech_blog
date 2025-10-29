import { Body, Card, Category, Cover, Grid, Summary, Title } from './NotionCardList.styles';

const SKELETON_COUNT = 10

const SKELETON_GRADIENT = 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)'
const SKELETON_STYLE = {
  background: SKELETON_GRADIENT,
  backgroundSize: '200% 100%',
  animation: 'skeleton-loading 1.5s infinite linear',
}

function SkeletonPlaceholder({ width, height, borderRadius = '4px' }: { width: string | number; height: string | number; borderRadius?: string }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        ...SKELETON_STYLE,
      }}
    />
  )
}

export function NotionCardSkeleton() {
  return (
    <Grid
      aria-busy="true"
      aria-label="카드 리스트 로딩 중"
      role="status"
    >
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <Card key={i} style={{ pointerEvents: 'none' }} aria-hidden="true">
          <Cover>
            <div
              style={{
                width: '100%',
                aspectRatio: '16/10',
                ...SKELETON_STYLE,
              }}
            />
          </Cover>
          <Body>
            <Category style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <SkeletonPlaceholder width="80px" height="24px" borderRadius="16px" />
              <span style={{ color: '#e0e0e0' }}>|</span>
              <SkeletonPlaceholder width="70px" height="20px" />
            </Category>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingRight: '1rem' }}>
              <Title>
                <SkeletonPlaceholder width="80%" height="24px" />
              </Title>
              <Summary>
                <SkeletonPlaceholder width="95%" height="18px" />
              </Summary>
              <Summary>
                <SkeletonPlaceholder width="60%" height="18px" />
              </Summary>
            </div>
          </Body>
        </Card>
      ))}
      <style>{`
        @keyframes skeleton-loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </Grid>
  )
}
