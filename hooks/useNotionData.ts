import { useCallback, useEffect, useState } from 'react';

import type { NotionPage } from '@/lib/notion-page';

import { getNotionCategories } from '../server/get-notion-categories';
import { getNotionPages } from '../server/get-notion-pages';
import { handleNotionPagesByCategory } from '../server/get-notion-pages-by-category';
import { getSearchedNotionPages } from '../server/get-search-notion-pages';

interface UseNotionDataProps {
  initialPages: NotionPage[];
  initialTotal: number;
  initialCategories: { category: string; order: number }[];
  pageSize: number;
  isPreview?: boolean;
}

export function useNotionData({
  initialPages,
  initialTotal,
  initialCategories,
  pageSize,
  isPreview = false,
}: UseNotionDataProps) {
  const [items, setItems] = useState<NotionPage[]>(initialPages || []);
  const [total, setTotal] = useState(initialTotal || 0);
  const [categories, setCategories] = useState(initialCategories.sort((a, b) => a.order - b.order));
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');

  // 데이터 페칭 로직
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let result;
      if (searchTerm.trim() !== '') {
        result = await getSearchedNotionPages(searchTerm, currentPage, pageSize, isPreview);
      } else {
        result = await handleNotionPagesByCategory(
          activeCategory,
          currentPage,
          pageSize,
          isPreview,
        );
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
  }, [activeCategory, currentPage, pageSize, searchTerm, isPreview]);

  // 카테고리, 페이지, 검색어 변경 시 데이터 페칭
  useEffect(() => {
    // 최초 로드 시 SSR 데이터를 사용하므로, 2페이지부터 혹은 필터링 시에만 fetch
    if (currentPage > 1 || activeCategory !== '전체' || searchTerm !== '') {
      void fetchData();
    }
    // SSR 데이터로 되돌아갈 때
    if (currentPage === 1 && activeCategory === '전체' && searchTerm === '') {
      setItems(initialPages);
      setTotal(initialTotal);
    }
  }, [currentPage, activeCategory, searchTerm, fetchData, initialPages, initialTotal]);

  // 최초 마운트 시 카테고리/아이템 데이터가 없으면 클라이언트 사이드에서 가져오기
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        if (categories.length === 0) {
          const cats = await getNotionCategories(true);
          setCategories(cats.sort((a, b) => a.order - b.order));
        }
        if (items.length === 0) {
          const res = await getNotionPages(true, 1, pageSize, isPreview);
          setItems(res.data);
          setTotal(res.total);
        }
      } catch (err) {
        console.error('Error fetching initial data:', err);
      } finally {
        setLoading(false);
      }
    };

    void fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 최초 마운트 시 쿼리스트링 category 파싱
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryFromQuery = params.get('category');
    if (categoryFromQuery) {
      setActiveCategory(decodeURIComponent(categoryFromQuery));
      setCurrentPage(1);
    }
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
