'use client';

import { useRef, useState } from 'react';

import { FloatingScrollTopButton } from '@/components/Button/Floating/FloatingScrollTopButton';
import { Footer } from '@/components/Footer/Footer';
import { Header } from '@/components/Header/Header';
import { ProfileSidebar } from '@/components/Sidebar/ProfileSidebar';
import { useNotionData } from '@/hooks/useNotionData';
import type { NotionPage } from '@/lib/notion-page';
import {
  Content,
  ContentContainer,
  Main,
  MainContent,
} from '@/styles/page-layout.styles';
import { NotionCardList } from 'app/(blog)/components/CardList/NotionCardList';
import { NotionCardSkeleton } from 'app/(blog)/components/CardList/NotionCardSkeleton';
import { NotionGalleryCarousel } from 'app/(blog)/components/Carousel/NotionGalleryCarousel';
import { Pagination } from 'app/(blog)/components/Pagenation/Pagination';
import { PaginationSkeleton } from 'app/(blog)/components/Pagenation/PaginationSkeleton';
import { SearchBar } from 'app/(blog)/components/Search/SearchBar';

interface NotionDomainPageClientProps {
  pages: NotionPage[];
  total: number;
  categories: { category: string; order: number; count: number }[];
}

export function NotionDomainPageClient({
  pages: initialPages,
  total: initialTotal,
  categories: initialCategories,
}: NotionDomainPageClientProps) {
  const [inputValue, setInputValue] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pageSize = 10;

  const {
    items,
    categories,
    loading,
    currentPage,
    totalPages,
    activeCategory,
    searchTerm,
    setCurrentPage,
    handleCategoryChange,
    handleSearch,
  } = useNotionData({
    initialPages,
    initialTotal,
    initialCategories,
    pageSize,
  });

  const handleSearchInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      handleSearch(inputValue);
    }
  };

  const handleSearchInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (newValue === '') {
      handleSearch('');
    }
  };

  return (
    <div>
      <Header
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        showToggle={true}
      />
      <ContentContainer>
        <ProfileSidebar
          name="HJ"
          email="jacker97@naver.com"
          bio="프론트엔드 개발자"
          githubUrl="https://github.com/hjlee7856"
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          isOpen={isSidebarOpen}
        />
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 100,
            }}
          />
        )}
        <MainContent>
          {initialPages.length === 0 ? (
            <NotionGalleryCarousel pages={items.slice(0, 10)} />
          ) : (
            <NotionGalleryCarousel pages={initialPages.slice(0, 10)} />
          )}
          <Main>
            <Content>
              <SearchBar
                value={inputValue}
                onChange={handleSearchInputChange}
                onSearch={() => {
                  if (debounceTimerRef.current)
                    clearTimeout(debounceTimerRef.current);
                  handleSearch(inputValue);
                }}
                onKeyDown={handleSearchInputKeyDown}
                loading={loading}
              />

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

                  if (searchTerm.length > 0 && items.length === 0) {
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
                      <NotionCardList pages={items} searchTerm={searchTerm} />
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                      />
                    </>
                  );
                })()}
              </section>
            </Content>
          </Main>

          <FloatingScrollTopButton />
        </MainContent>
      </ContentContainer>
      <Footer />
    </div>
  );
}

export default NotionDomainPageClient;
