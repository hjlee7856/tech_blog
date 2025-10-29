import Image from 'next/image';
import React from 'react';

import type { NotionPage } from '@/lib/notion-page';

import { Body, Card, Category, Cover, CoverPlaceholder, Grid, Summary, Title } from './NotionCardList.styles';

interface NotionCardListProps {
  pages: NotionPage[];
  inputValue: string;
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

export function NotionCardList({ pages, inputValue }: NotionCardListProps) {
  return (
    <Grid>
      {pages.map((page) => (
        <Card
          key={page.id}
          href={`/post/${page.id}`}
          tabIndex={0}
          aria-label={page.title}
        >
          <Cover>
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
                  src={`${page.cover}`}
                  alt={page.title}
                  loading="lazy"
                  fill
                  sizes="(max-width: 600px) 100vw, 300px"
                />
              </div>
            ) : (
              <CoverPlaceholder />
            )}
          </Cover>
          <Body>
            {page.category && page.created_date && (
              <Category
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
              </Category>
            )}
            <div
              style={{
                paddingRight: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <Title>
                {highlight(page.title, inputValue)}
              </Title>
              {page.description && (
                <Summary>
                  {highlight(page.description, inputValue)}
                </Summary>
              )}
            </div>
          </Body>
        </Card>
      ))}
    </Grid>
  )
}
