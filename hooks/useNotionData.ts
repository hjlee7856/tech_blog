import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import type { NotionPage } from '@/lib/notion-page';

import { getNotionCategories } from '../server/get-notion-categories';
import { handleNotionPagesByCategory } from '../server/get-notion-pages-by-category';
import { getSearchedNotionPages } from '../server/get-notion-pages-by-search';

interface UseNotionDataProps {
  initialPages: NotionPage[];
  initialTotal: number;
  initialCategories: { category: string; order: number; count: number }[];
  pageSize: number;
}

export function useNotionData({
  initialPages,
  initialTotal,
  initialCategories,
  pageSize,
}: UseNotionDataProps) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const categoryFromUrl = useMemo(
    () => (categoryParam ? decodeURIComponent(categoryParam) : '전체'),
    [categoryParam],
  );

  const [items, setItems] = useState<NotionPage[]>(initialPages || []);
  const [total, setTotal] = useState(initialTotal || 0);
  const [categories, setCategories] = useState(
    initialCategories.toSorted((a, b) => a.order - b.order),
  );
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState(categoryFromUrl);
  const [searchTerm, setSearchTerm] = useState('');

  // 초기 로드 시에만 URL 파라미터로 activeCategory 설정
  useEffect(() => {
    setActiveCategory(categoryFromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 카테고리, 페이지, 검색어 변경 시 데이터 페칭
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let result;
        if (searchTerm.trim() !== '') {
          result = await getSearchedNotionPages(searchTerm, currentPage, pageSize);
        } else if (activeCategory === '전체') {
          const params = new URLSearchParams({
            page: currentPage.toString(),
            pageSize: pageSize.toString(),
          });
          const res = await fetch(`/api/get-notion-pages?${params.toString()}`);
          if (!res.ok) throw new Error('Failed to fetch pages');
          result = (await res.json()) as { data: NotionPage[]; total: number };
        } else {
          result = (await handleNotionPagesByCategory(activeCategory, currentPage, pageSize)) as {
            data: NotionPage[];
            total: number;
          };
        }

        if (result) {
          setItems(result.data);
          setTotal(result.total);
        }
      } catch (err) {
        console.error('Failed to fetch notion data', err);
        setItems([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    // 최초 로드 시 SSR 데이터를 사용하므로, 2페이지부터 혹은 필터링 시에만 fetch
    if (currentPage > 1 || activeCategory !== '전체' || searchTerm !== '') {
      void fetchData();
    }
    // SSR 데이터로 되돌아갈 때
    if (currentPage === 1 && activeCategory === '전체' && searchTerm === '') {
      setItems(initialPages);
      setTotal(initialTotal);
    }
  }, [currentPage, activeCategory, searchTerm, pageSize, initialPages, initialTotal]);

  // 최초 마운트 시 카테고리 데이터가 없으면 클라이언트 사이드에서 가져오기
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        if (categories.length === 0) {
          const cats = await getNotionCategories();
          setCategories(cats.toSorted((a, b) => a.order - b.order));
        }
      } catch (err) {
        console.error('Error fetching initial data:', err);
      }
    };

    void fetchInitialData();
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    setSearchTerm('');
    setActiveCategory(category);
    setCurrentPage(1);
  }, []);

  const handleSearch = useCallback((newSearchTerm: string) => {
    setActiveCategory('전체');
    setSearchTerm(newSearchTerm);
    setCurrentPage(1);
  }, []);

  return {
    items,
    total,
    categories,
    loading,
    currentPage,
    totalPages: Math.ceil(total / pageSize),
    activeCategory,
    searchTerm,
    setCurrentPage,
    handleCategoryChange,
    handleSearch,
  };
}
