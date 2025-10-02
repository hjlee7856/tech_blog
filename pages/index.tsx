'use client';
import { type GetStaticProps } from 'next';
import { useState } from 'react';

import type { NotionPage } from '@/lib/notion-page';
import { FloatingScrollTopButton } from '@/components/common/FloatingScrollTopButton';
import { Footer } from '@/components/Footer';
import { NotionCardList } from '@/components/NotionCardList';
import { NotionCardSkeleton } from '@/components/NotionCardSkeleton';
import { NotionCategoryFilter } from '@/components/NotionCategoryFilter';
import { NotionGalleryCarousel } from '@/components/NotionGalleryCarousel';
import { NotionPageHeader } from '@/components/NotionPageHeader';
import { NotionPageMeta } from '@/components/NotionPageMeta';
import { Pagination } from '@/components/Pagination';
import { PaginationSkeleton } from '@/components/PaginationSkeleton';
import { SearchBar } from '@/components/SearchBar';
import styles from '@/components/styles.module.css';
import { useNotionData } from '@/hooks/useNotionData';

import { getNotionCategories } from '../server/get-notion-categories';
import { getNotionPages } from '../server/get-notion-pages';

export const getStaticProps: GetStaticProps = async () => {
  try {
    const { data, total } = await getNotionPages(false, 1, 10);
    const categoriesData = await getNotionCategories(false);

    return {
      props: {
        pages: data,
        total,
        categories: categoriesData,
      },
      revalidate: 300, // 5분마다 ISR
    };
  } catch (err) {
    console.error('ISR error', err);
    return { notFound: true };
  }
};

interface NotionDomainPageProps {
  pages: NotionPage[];
  total: number;
  categories: { category: string; order: number }[];
}

export default function NotionDomainPage(props: NotionDomainPageProps) {
  const [inputValue, setInputValue] = useState('');
  const pageSize = 10; // 한 페이지에 10개

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
    initialPages: props.pages,
    initialTotal: props.total,
    initialCategories: props.categories,
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
      <NotionPageMeta
        title={'데일리펀딩의 특별한 블로그, 데일리 인사이트'}
        description={'일상이 특별해지는 금융 데일리펀딩의 이야기가 담긴 블로그'}
        image={'/sns_logo.png'}
        url={`https://${process.env.VERCEL_DOMAIN}`}
      />
      <NotionPageHeader />
      {/* 캐로셀 */}
      {props.pages.length === 0 ? (
        <NotionGalleryCarousel pages={items.slice(0, 10)} />
      ) : (
        <NotionGalleryCarousel pages={props.pages.slice(0, 10)} />
      )}
      <div className={styles.main}>
        <div className={styles.content}>
          <section className={styles.categorySection}>
            {/* 카테고리 리스트 */}
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
            {/* 컨텐츠 표시 영역 */}
            {(() => {
              if (props.pages.length === 0 && loading) {
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
