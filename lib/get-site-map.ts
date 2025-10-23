import { getAllPagesInSpace, getPageProperty } from 'notion-utils';
import pMemoize from 'p-memoize';

import * as config from './config';
import { includeNotionIdInUrls } from './config';
import { getCanonicalPageId } from './get-canonical-page-id';
import { notion } from './notion-api';
import type * as types from './types';

const uuid = !!includeNotionIdInUrls;

export async function getSiteMap(): Promise<types.SiteMap> {
  const partialSiteMap = await getAllPages(
    config.rootNotionPageId,
    config.rootNotionSpaceId ?? undefined,
  );

  return {
    site: config.site,
    ...partialSiteMap,
  } as types.SiteMap;
}

const getAllPages = pMemoize(getAllPagesImpl, {
  cacheKey: (...args) => JSON.stringify(args),
});

const getPage = async (pageId: string, opts?: any) => {
  return notion.getPage(pageId, {
    kyOptions: {
      timeout: 30_000,
    },
    ...opts,
  });
};

async function getAllPagesImpl(
  rootNotionPageId: string,
  rootNotionSpaceId?: string,
  {
    maxDepth = 1,
  }: {
    maxDepth?: number;
  } = {},
): Promise<Partial<types.SiteMap>> {
  const pageMap = await getAllPagesInSpace(rootNotionPageId, rootNotionSpaceId, getPage, {
    maxDepth,
  });

  const canonicalPageMap = Object.keys(pageMap).reduce(
    (map: Record<string, string>, pageId: string) => {
      const recordMap = pageMap[pageId];
      if (!recordMap) {
        console.warn(`Skipping page "${pageId}" - failed to load`);
        return map;
      }

      const block = recordMap.block[pageId]?.value;
      if (!block) {
        console.warn(`Skipping page "${pageId}" - no block found`);
        return map;
      }

      if (!(getPageProperty<boolean | null>('Public', block, recordMap) ?? true)) {
        return map;
      }

      const canonicalPageId = getCanonicalPageId(pageId, recordMap, {
        uuid,
      });

      if (!canonicalPageId) {
        console.warn(`Skipping page "${pageId}" - no canonical page id`);
        return map;
      }

      if (map[canonicalPageId]) {
        console.warn('error duplicate canonical page id', {
          canonicalPageId,
          pageId,
          existingPageId: map[canonicalPageId],
        });

        return map;
      } else {
        return {
          ...map,
          [canonicalPageId]: pageId,
        };
      }
    },
    {},
  );

  return {
    pageMap,
    canonicalPageMap,
  };
}
