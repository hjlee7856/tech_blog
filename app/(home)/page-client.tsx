'use client';

import { useState } from 'react';

import { FloatingScrollTopButton } from '@/components/Button/Floating/FloatingScrollTopButton';
import { Footer } from '@/components/Footer/Footer';
import { useNotionData } from '@/hooks/useNotionData';
import type { NotionPage } from '@/lib/notion-page';
import styles from '@/styles/styles.module.css';
import { NotionCardList } from 'app/(home)/components/CardList/NotionCardList';
import { NotionCardSkeleton } from 'app/(home)/components/CardList/NotionCardSkeleton';
import { NotionGalleryCarousel } from 'app/(home)/components/Carousel/NotionGalleryCarousel';
import { NotionCategoryFilter } from 'app/(home)/components/Category/NotionCategoryFilter';
import { Pagination } from 'app/(home)/components/Pagenation/Pagination';
import { PaginationSkeleton } from 'app/(home)/components/Pagenation/PaginationSkeleton';
import { SearchBar } from 'app/(home)/components/Search/SearchBar';

interface NotionDomainPageClientProps {
  pages: NotionPage[];
  total: number;
  categories: { category: string; order: number }[];
}

export function NotionDomainPageClient({
  pages: initialPages,
  total: initialTotal,
  categories: initialCategories,
}: NotionDomainPageClientProps) {
  const [inputValue, setInputValue] = useState('');
  const pageSize = 10;

  const {
    items,
    categories,
    loading,
    currentPage,
    totalPages,
    activeCategory,
    setCurrentPage,
    handleCategoryChange,
    handleSearch,
  } = useNotionData({
    initialPages,
    initialTotal,
    initialCategories,
    pageSize,
  });

  const handleSearchInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(inputValue);
    }
  };

  return (
    <>
      {initialPages.length === 0 ? (
        <NotionGalleryCarousel pages={items.slice(0, 10)} />
      ) : (
        <NotionGalleryCarousel pages={initialPages.slice(0, 10)} />
      )}
      <div className={styles.main}>
        <div className={styles.content}>
          <section className={styles.categorySection}>
            <NotionCategoryFilter
              activeCategory={activeCategory}
              categories={categories.map((category) => category.category)}
              onCategoryChange={async (category: string) => {
                setInputValue('');
                handleCategoryChange(category);
              }}
            />

            <SearchBar
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const newValue = e.target.value;
                setInputValue(newValue);
                if (newValue === '') {
                  handleSearch('');
                }
              }}
              onSearch={() => {
                handleSearch(inputValue);
              }}
              onKeyDown={handleSearchInputKeyDown}
              loading={loading}
            />
          </section>

          <section
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              gap: 8,
            }}
          >
            {(() => {
              if (initialPages.length === 0 && loading) {
                return (
                  <>
                    <NotionCardSkeleton />
                    <PaginationSkeleton />
                  </>
                );
              }

              if (inputValue.length > 0 && items.length === 0) {
                return (
                  <div
                    style={{
                      width: '100%',
                      maxWidth: 700,
                      padding: '48px 0',
                      textAlign: 'center',
                      color: '#6b7280',
                      fontSize: 20,
                      fontWeight: 500,
                    }}
                  >
                    검색 결과가 없습니다
                  </div>
                );
              }

              return (
                <>
                  <NotionCardList pages={items} inputValue={inputValue} />
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </>
              );
            })()}
          </section>
        </div>
      </div>
      <Footer />
      <FloatingScrollTopButton />
    </>
  );
}

export default NotionDomainPageClient;
