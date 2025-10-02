import type { Decoration, ExtendedRecordMap } from 'notion-types'
import { useCallback, useMemo, useState } from 'react'

/**
 * Notion 컬렉션뷰의 카테고리 목록을 추출하는 함수
 */
function extractCategories(recordMap: ExtendedRecordMap): string[] {
  const collection = Object.values(recordMap.collection)[0]?.value
  const schema = collection?.schema ?? {}

  // 카테고리 컬럼 찾기
  const categoryKey = Object.entries(schema).find(([, v]: any) =>
    ['카테고리', 'category', '분류', 'Category'].includes(v.name)
  )?.[0]

  if (!categoryKey) return []

  // 모든 페이지에서 카테고리 값 추출
  const categories = Object.values(recordMap.block)
    .filter(
      (b: any) =>
        b.value?.type === 'page' && b.value?.parent_table === 'collection'
    )
    .map((b: any) => {
      if (b.value.properties?.[categoryKey]) {
        return b.value.properties[categoryKey][0][0]
      }
      return null
    })
    .filter(Boolean) as string[]

  // 중복 제거 및 정렬
  return [...new Set(categories)].sort()
}

interface UseCategoryProps {
  recordMap: ExtendedRecordMap | null
}

interface UseCategoryReturn {
  categories: string[]
  activeCategory: string | null
  setActiveCategory: (category: string | null) => void
  handleCategoryChange: (category: string | null) => void
  resetCategory: () => void
}

export function useCategory({
  recordMap
}: UseCategoryProps): UseCategoryReturn {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const categories = useMemo(() => {
    if (!recordMap) return []
    return extractCategories(recordMap)
  }, [recordMap])

  const handleCategoryChange = useCallback((category: string | null) => {
    setActiveCategory(category)
  }, [])

  const resetCategory = useCallback(() => {
    setActiveCategory(null)
  }, [])

  // 카테고리 변경 시 페이지네이션 등 추가 동작이 필요한 경우 여기에 추가

  return {
    categories,
    activeCategory,
    setActiveCategory,
    handleCategoryChange,
    resetCategory
  }
}

/**
 * 카테고리에 따라 필터링된 recordMap을 생성하는 함수
 */
export function filterRecordMapByCategory(
  recordMap: ExtendedRecordMap,
  category: string | null,
  currentPageId: string,
  rootPageId: string
): ExtendedRecordMap {
  // 카테고리가 없으면 원본 recordMap 반환
  if (!category) return recordMap

  // 원본 recordMap 복제
  const filteredMap = structuredClone(recordMap) as ExtendedRecordMap

  // 컬렉션 스키마에서 카테고리 필드 키 찾기
  const collection = Object.values(filteredMap.collection)[0]?.value
  const schema = collection?.schema ?? {}

  const categoryKey = Object.entries(schema).find(([, v]: any) =>
    ['카테고리', 'category', '분류', 'Category'].includes(v.name)
  )?.[0]

  if (!categoryKey) return recordMap

  // 카테고리에 맞는 페이지만 필터링
  const filteredBlocks: Record<string, any> = {}

  for (const [id, blockData] of Object.entries(filteredMap.block)) {
    const block = blockData.value

    // 페이지 블록이면서 컬렉션에 속한 경우
    if (block?.type === 'page' && block?.parent_table === 'collection') {
      // 해당 블록의 카테고리 값 확인
      const blockCategory = (
        block.properties as Record<string, Decoration[]> | undefined
      )?.[categoryKey]?.[0]?.[0]

      // 카테고리가 일치하거나, 부모 블록인 경우 포함
      if (
        blockCategory === category ||
        block.id === currentPageId ||
        block.id === rootPageId
      ) {
        filteredBlocks[id] = blockData
      }
    } else {
      // 페이지가 아닌 블록은 모두 포함
      filteredBlocks[id] = blockData
    }
  }

  // 필터링된 블록으로 recordMap 업데이트
  filteredMap.block = filteredBlocks

  return filteredMap
}
