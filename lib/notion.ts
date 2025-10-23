import { unstable_cache } from 'next/cache';
import { type ExtendedRecordMap, type SearchParams, type SearchResults } from 'notion-types';
import { mergeRecordMaps } from 'notion-utils';
import pMap from 'p-map';
import pMemoize from 'p-memoize';

import { isPreviewImageSupportEnabled, navigationLinks, navigationStyle } from './config';

import { notion } from './notion-api';
import { getPreviewImageMap } from './preview-images';

const getNavigationLinkPages = pMemoize(async (): Promise<ExtendedRecordMap[]> => {
  const navigationLinkPageIds = (navigationLinks || []).map((link) => link?.pageId).filter(Boolean);

  if (navigationStyle !== 'default' && navigationLinkPageIds.length) {
    return pMap(
      navigationLinkPageIds,
      async (navigationLinkPageId) =>
        notion.getPage(navigationLinkPageId, {
          chunkLimit: 1,
          fetchMissingBlocks: false,
          fetchCollections: false,
          signFileUrls: false,
        }),
      {
        concurrency: 4,
      },
    );
  }

  return [];
});

const getPageUncached = async (pageId: string): Promise<ExtendedRecordMap> => {
  let recordMap = await notion.getPage(pageId);

  if (navigationStyle !== 'default') {
    const navigationLinkRecordMaps = await getNavigationLinkPages();

    if (navigationLinkRecordMaps?.length) {
      recordMap = navigationLinkRecordMaps.reduce(
        (map, navigationLinkRecordMap) => mergeRecordMaps(map, navigationLinkRecordMap),
        recordMap,
      );
    }
  }

  if (isPreviewImageSupportEnabled) {
    const previewImageMap = await getPreviewImageMap(recordMap);
    (recordMap as any).preview_images = previewImageMap;
  }

  return recordMap;
};

export const getPage = unstable_cache(getPageUncached, ['getPage'], { revalidate: 3600 });

export async function search(params: SearchParams): Promise<SearchResults> {
  return notion.search(params);
}
