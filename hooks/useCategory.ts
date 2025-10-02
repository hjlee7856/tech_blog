import type { Decoration, ExtendedRecordMap } from 'notion-types'
import { useCallback, useMemo, useState } from 'react'

function extractCategories(recordMap: ExtendedRecordMap): string[] {
  const collection = Object.values(recordMap.collection)[0]?.value
  const schema = collection?.schema ?? {}

  const categoryKey = Object.entries(schema).find(([, v]: any) =>
    ['카테고리', 'category', '분류', 'Category'].includes(v.name)
  )?.[0]

  if (!categoryKey) return []

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

  return {
    categories,
    activeCategory,
    setActiveCategory,
    handleCategoryChange,
    resetCategory
  }
}

export function filterRecordMapByCategory(
  recordMap: ExtendedRecordMap,
  category: string | null,
  currentPageId: string,
  rootPageId: string
): ExtendedRecordMap {
  if (!category) return recordMap

  const filteredMap = structuredClone(recordMap) as ExtendedRecordMap

  const collection = Object.values(filteredMap.collection)[0]?.value
  const schema = collection?.schema ?? {}

  const categoryKey = Object.entries(schema).find(([, v]: any) =>
    ['카테고리', 'category', '분류', 'Category'].includes(v.name)
  )?.[0]

  if (!categoryKey) return recordMap

  const filteredBlocks: Record<string, any> = {}

  for (const [id, blockData] of Object.entries(filteredMap.block)) {
    const block = blockData.value

    if (block?.type === 'page' && block?.parent_table === 'collection') {
      const blockCategory = (
        block.properties as Record<string, Decoration[]> | undefined
      )?.[categoryKey]?.[0]?.[0]

      if (
        blockCategory === category ||
        block.id === currentPageId ||
        block.id === rootPageId
      ) {
        filteredBlocks[id] = blockData
      }
    } else {
      filteredBlocks[id] = blockData
    }
  }

  filteredMap.block = filteredBlocks

  return filteredMap
}
