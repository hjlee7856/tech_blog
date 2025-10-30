import { CategoryFilterSkeleton } from './CategoryFilterSkeleton'
import { ActiveButton, Button, Container } from './NotionCategoryFilter.styles'

interface NotionCategoryFilterProps {
  onCategoryChange: (category: string) => void
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
          전체 ({categories.reduce((total, cat) => total + cat.count, 0)})
        </ActiveButton>
      ) : (
        <Button onClick={() => onCategoryChange('전체')}>
          전체 ({categories.reduce((total, cat) => total + cat.count, 0)})
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
