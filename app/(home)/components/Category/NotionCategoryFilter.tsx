import { CategoryFilterSkeleton } from './CategoryFilterSkeleton'
import { Container, Button, ActiveButton } from './NotionCategoryFilter.styles'

interface NotionCategoryFilterProps {
  onCategoryChange: (category: string) => Promise<void>
  activeCategory: string
  categories: { category: string; order: number; count: number }[]
}

export function NotionCategoryFilter({
  onCategoryChange,
  activeCategory,
  categories,
}: NotionCategoryFilterProps) {
  if (!categories || categories.length === 0) {
    return <CategoryFilterSkeleton />
  }

  return (
    <Container>
      {activeCategory === '전체' ? (
        <ActiveButton onClick={() => onCategoryChange('전체')}>
          전체
        </ActiveButton>
      ) : (
        <Button onClick={() => onCategoryChange('전체')}>
          전체
        </Button>
      )}
      {categories.map((cat) => (
        activeCategory === cat.category ? (
          <ActiveButton
            key={cat.category}
            onClick={() => onCategoryChange(cat.category)}
          >
            {cat.category} ({cat.count})
          </ActiveButton>
        ) : (
          <Button
            key={cat.category}
            onClick={() => onCategoryChange(cat.category)}
          >
            {cat.category} ({cat.count})
          </Button>
        )
      ))}
    </Container>
  )
}
