import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import type { NotionPage } from '@/lib/notion-page';

import styles from './NotionCardList.module.css';

interface NotionCardListProps {
  pages: NotionPage[];
  inputValue: string;
  preview?: boolean;
}

function highlight(text: string, keyword: string) {
  if (!keyword || keyword.trim() === '') return text;
  // eslint-disable-next-line security/detect-non-literal-regexp
  const regex = new RegExp(`(${keyword.replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} style={{ background: '#ffe066', color: 'inherit', padding: 0 }}>
        {part}
      </mark>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    ),
  );
}

export function NotionCardList({ pages, inputValue, preview }: NotionCardListProps) {
  return (
    <div className={styles['notion-gallery-grid']}>
      {pages.map((page) => (
        <Link
          key={page.id}
          href={preview ? `/preview/post?post_id=${page.post_id}` : `/post?post_id=${page.post_id}`}
          className={styles['notion-collection-card']}
          tabIndex={0}
          aria-label={page.title}
        >
          {/* TODO: 썸네일 이미지 */}
          <div className={styles['notion-collection-card-cover']}>
            {page.cover ? (
              <div
                style={{
                  position: 'relative',
                  flex: 1,
                  width: '100%',
                  height: '100%',
                  aspectRatio: '16/10',
                }}
              >
                <Image
                  src={`/api/image-proxy?url=${encodeURIComponent(page.cover)}`}
                  alt={page.title}
                  loading="lazy"
                  fill
                  sizes="(max-width: 600px) 100vw, 300px"
                />
              </div>
            ) : (
              <div className={styles['notion-collection-card-cover-placeholder']} />
            )}
          </div>
          <div className={styles['notion-collection-card-body']}>
            {page.category && page.created_date && (
              <div
                className={styles['notion-collection-card-category']}
                style={{
                  WebkitLineClamp: 1,
                  lineClamp: 1,
                }}
              >
                <div
                  style={{
                    display: 'inline-block',
                    color: '#868b94',
                    backgroundColor: '#f2f3f6',
                    borderRadius: '16px',
                    padding: '0.25rem 0.5rem',
                  }}
                >
                  {page.category}
                </div>
                <div
                  style={{
                    color: '#868b94',
                    display: 'inline-block',
                    marginLeft: '0.5rem',
                  }}
                >
                  |
                </div>
                <div
                  style={{
                    marginLeft: '0.5rem',
                    display: 'inline-block',
                    color: '#868b94',
                  }}
                >
                  {page.created_date}
                </div>
              </div>
            )}
            <div
              style={{
                paddingRight: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <div className={styles['notion-collection-card-title']}>
                {highlight(page.title, inputValue)}
              </div>
              {page.description && (
                <div className={styles['notion-collection-card-summary']}>
                  {highlight(page.description, inputValue)}
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
