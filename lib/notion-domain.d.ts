// NotionDomainPageProps 타입 정의
// NotionGalleryCarousel에서 사용한 NotionGalleryItem과 호환되도록 작성

export interface NotionDomainPageProps {
  pages: Array<{
    id: string
    cover?: string | null
    category?: string | null
    title: string
    description?: string | null
    [key: string]: any
  }>
}
