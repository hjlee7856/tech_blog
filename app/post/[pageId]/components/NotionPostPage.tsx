import cs from 'classnames';
import Image from 'next/legacy/image';
import Link from 'next/link';
import * as React from 'react';
import { type NotionComponents, NotionRenderer } from 'react-notion-x';
import { useSearchParam } from 'react-use';

import * as config from '@/lib/config';
import { mapImageUrl } from '@/lib/map-image-url';
import { mapPageUrl } from '@/lib/map-page-url';
import { searchNotion } from '@/lib/search-notion';
import type * as types from '@/lib/types';

import { FloatingScrollTopButton } from '../../../../components/Button/Floating/FloatingScrollTopButton';
import { ShareButton } from '../../../../components/Button/Share/Share';
import { Code, Collection, Equation, Modal } from '../../../../components/dynamicImport';
import { Footer } from '../../../../components/Footer/Footer';
import { PostOverlay } from './Overlay/PostOverlay';

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

interface NotionPostPageProps extends types.PageProps {
  isDarkMode: boolean;
}

export function NotionPostPage({ site, recordMap, error }: NotionPostPageProps) {
  const lite = useSearchParam('lite');
  const components = React.useMemo<Partial<NotionComponents>>(
    () => ({
      nextImage: Image,
      nextLink: Link,
      Header: false,
      Code,
      Collection,
      Equation,
      Modal,
      propertyTextValue,
    }),
    [],
  );

  // lite mode is for oembed
  const siteMapPageUrl = React.useMemo(() => {
    const params: any = {};
    if (lite) params.lite = lite;

    const searchParams = new URLSearchParams(params);
    return site ? mapPageUrl(site, recordMap!, searchParams) : undefined;
  }, [site, recordMap, lite]);

  const keys = Object.keys(recordMap?.block || {});
  const block = recordMap?.block?.[keys[0]!]?.value;

  const minTableOfContentsItems = 3;

  if (error || !site || !block) {
    return <div>error</div>;
  }

  return (
    <>
      <PostOverlay {...getCollectionRowProps(recordMap, block)} />

      {/* notion renderer */}
      <div className={cs('notion', 'light-mode')}>
        <NotionRenderer
          bodyClassName="notion"
          darkMode={false}
          components={components}
          recordMap={recordMap}
          rootPageId={site.rootNotionPageId}
          rootDomain={site.domain}
          fullPage={!false}
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
          disableHeader
        />
        <div className="notion">
          <div className={'notion-page'}>
            {/* 공유버튼 */}
            <ShareButton />
          </div>
        </div>
        <Footer />
      </div>
      <FloatingScrollTopButton />
    </>
  );
}
