import type { PageBlock } from 'notion-types';
import cs from 'classnames';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { formatDate, getBlockTitle, getPageProperty } from 'notion-utils';
import * as React from 'react';
import { type NotionComponents, NotionRenderer } from 'react-notion-x';
import { useSearchParam } from 'react-use';

import type * as types from '@/lib/types';
import * as config from '@/lib/config';
import { mapImageUrl } from '@/lib/map-image-url';
import { getCanonicalPageUrl, mapPageUrl } from '@/lib/map-page-url';
import { searchNotion } from '@/lib/search-notion';
import { useDarkMode } from '@/lib/use-dark-mode';

import { FloatingScrollTopButton } from './common/FloatingScrollTopButton';
import { Code, Collection, Equation, Modal, Pdf } from './dynamicImport';
import { Footer } from './Footer';
import { Loading } from './Loading';
import { NotionFooterCard } from './NotionFooterCard';
import { NotionPageHeader } from './NotionPageHeader';
import { NotionPageMeta } from './NotionPageMeta';
import { Page404 } from './Page404';
import { PostOverlay } from './PostOverlay';
import { ShareButton } from './ShareButton';
import styles from './styles.module.css';

const propertyLastEditedTimeValue = (
  { block, pageHeader }: any,
  defaultFn: () => React.ReactNode,
) => {
  if (pageHeader && block?.last_edited_time) {
    return `Last updated ${formatDate(block?.last_edited_time, {
      month: 'long',
    })}`;
  }

  return defaultFn();
};

const propertyDateValue = ({ data, schema, pageHeader }: any, defaultFn: () => React.ReactNode) => {
  if (pageHeader && schema?.name?.toLowerCase() === 'published') {
    const publishDate = data?.[0]?.[1]?.[0]?.[1]?.start_date;

    if (publishDate) {
      return `${formatDate(publishDate, {
        month: 'long',
      })}`;
    }
  }

  return defaultFn();
};

const propertyTextValue = ({ schema, pageHeader }: any, defaultFn: () => React.ReactNode) => {
  if (pageHeader && schema?.name?.toLowerCase() === 'author') {
    return <b>{defaultFn()}</b>;
  }

  return defaultFn();
};

// Notion collection row에서 title, subtitle, category property를 동적으로 추출하는 함수
// recordMap: Notion의 전체 데이터, block: 각 row의 block.value
// 반환: { title, subtitle, category }
export function getCollectionRowProps(
  recordMap: any,
  block: any,
): {
  title: string;
  subtitle: string;
  category: string;
} {
  if (!recordMap?.collection || !block?.properties) {
    return { title: '', subtitle: '', category: '' };
  }
  const collection = (Object.values(recordMap.collection)[0] as { value?: any })?.value;
  const schema = collection?.schema ?? {};
  // 각 property의 key를 schema에서 동적으로 추출
  const titleKey = Object.entries(schema).find(([, v]: any) =>
    ['제목', 'title', 'Title'].includes(v.name),
  )?.[0];
  const subtitleKey = Object.entries(schema).find(([, v]: any) =>
    ['부제목', 'subtitle', 'Subtitle'].includes(v.name),
  )?.[0];
  const categoryKey = Object.entries(schema).find(([, v]: any) =>
    ['카테고리', 'category', '분류', 'Category'].includes(v.name),
  )?.[0];

  // block에서 실제 값 추출
  const title = titleKey ? (block.properties[titleKey]?.[0]?.[0] ?? '') : '';
  const subtitle = subtitleKey ? (block.properties[subtitleKey]?.[0]?.[0] ?? '') : '';
  const category = categoryKey ? (block.properties[categoryKey]?.[0]?.[0] ?? '') : '';
  return { title, subtitle, category };
}

export function NotionPostPage({
  site,
  recordMap,
  error,
  pageId,
  preview,
}: types.PageProps & { preview?: boolean }) {
  const router = useRouter();
  const lite = useSearchParam('lite');
  const components = React.useMemo<Partial<NotionComponents>>(
    () => ({
      nextLegacyImage: Image,
      nextLink: Link,
      Code,
      Collection,
      Equation,
      Pdf,
      Modal,
      Header: NotionPageHeader,
      propertyLastEditedTimeValue,
      propertyTextValue,
      propertyDateValue,
    }),
    [],
  );

  // lite mode is for oembed
  const isLiteMode = lite === 'true';

  const { isDarkMode } = useDarkMode();

  const siteMapPageUrl = React.useMemo(() => {
    const params: any = {};
    if (lite) params.lite = lite;

    const searchParams = new URLSearchParams(params);
    return site ? mapPageUrl(site, recordMap!, searchParams) : undefined;
  }, [site, recordMap, lite]);

  const keys = Object.keys(recordMap?.block || {});
  const block = recordMap?.block?.[keys[0]!]?.value;

  const minTableOfContentsItems = 3;

  // 소셜 미디어 공유용 이미지 URL 처리 - 조건부 반환 이전으로 이동
  const socialImage = React.useMemo(() => {
    if (!block || !recordMap) return config.defaultPageCover;
    return mapImageUrl(
      getPageProperty<string>('Social Image', block, recordMap) ||
        (block as PageBlock).format?.page_cover ||
        config.defaultPageCover,
      block,
    );
  }, [block, recordMap]);

  // 소셜 미디어 공유용 설명 텍스트 - 조건부 반환 이전으로 이동
  const socialDescription = React.useMemo(() => {
    if (!block || !recordMap) return config.description;
    return getPageProperty<string>('요약', block, recordMap) || config.description;
  }, [block, recordMap]);

  if (router.isFallback) {
    return <Loading />;
  }

  if (error || !site || !block) {
    return <Page404 site={site} pageId={pageId} error={error} />;
  }

  const title = getBlockTitle(block, recordMap) || site.name;

  // 운영 환경에서 캐노니커 URL 관리
  const canonicalPageUrl = config.isDev ? undefined : getCanonicalPageUrl(site, recordMap)(pageId);

  if (!config.isServer) {
    // add important objects to the window global for easy debugging
    const g = window as any;
    g.pageId = pageId;
    g.recordMap = recordMap;
    g.block = block;
  }

  return (
    <>
      <NotionPageMeta
        title={title}
        description={socialDescription}
        image={socialImage}
        url={canonicalPageUrl}
      />

      <PostOverlay {...getCollectionRowProps(recordMap, block)} preview={preview} />

      {/* notion renderer */}
      <div className={cs('notion', isDarkMode ? 'dark-mode' : 'light-mode')}>
        <NotionRenderer
          bodyClassName={cs(styles.notion)}
          darkMode={isDarkMode}
          components={components}
          recordMap={recordMap}
          rootPageId={site.rootNotionPageId}
          rootDomain={site.domain}
          fullPage={!isLiteMode}
          previewImages={!!recordMap.preview_images}
          showCollectionViewDropdown={false}
          showTableOfContents={false}
          minTableOfContentsItems={minTableOfContentsItems}
          defaultPageIcon={config.defaultPageIcon}
          defaultPageCover={config.defaultPageCover}
          defaultPageCoverPosition={config.defaultPageCoverPosition}
          mapPageUrl={siteMapPageUrl}
          mapImageUrl={mapImageUrl}
          searchNotion={config.isSearchEnabled ? searchNotion : undefined}
        />
        <div className="notion">
          <div className={'notion-page'}>
            {/* 공유버튼 */}
            <ShareButton />
            <NotionFooterCard />
          </div>
        </div>
        <Footer />
      </div>
      <FloatingScrollTopButton />
    </>
  );
}
