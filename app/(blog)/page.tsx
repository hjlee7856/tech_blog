import { type Metadata } from 'next';
import { Suspense } from 'react';

import { getNotionCategories } from '../../server/get-notion-categories';
import { getNotionPages } from '../../server/get-notion-pages';
import { NotionDomainPageClient } from './page-client';

export const metadata: Metadata = {
  title: 'HJ의 기술블로그',
  description: 'HJ Tech Blog',
  openGraph: {
    title: 'HJ의 기술블로그',
    description: 'HJ Tech Blog',
    type: 'website',
    url: 'https://hj1997-tech-blog.vercel.app',
    images: [
      {
        url: 'https://hj1997-tech-blog.vercel.app/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HJ의 기술블로그',
    description: 'HJ Tech Blog',
    images: [
      {
        url: 'https://hj1997-tech-blog.vercel.app/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default async function NotionDomainPage() {
  const { data, total } = await getNotionPages(false, 1, 10);
  const categoriesData = await getNotionCategories();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotionDomainPageClient
        pages={data}
        total={total}
        categories={categoriesData}
      />
    </Suspense>
  );
}
