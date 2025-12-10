import { type Metadata } from 'next';
import { notFound } from 'next/navigation';

import { domain } from '@/lib/config';
import { resolveNotionPage } from '@/lib/resolve-notion-page';
import { increaseNotionView } from '@/server/increase-notion-view';
import { NotionPostPageClient } from './post-client';

interface PostPageProps {
  params: Promise<{ pageId: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { pageId } = await params;

  if (!pageId) {
    return {};
  }

  try {
    const props = await resolveNotionPage(domain, pageId);

    if (props.error || !props.recordMap) {
      return {};
    }

    const keys = Object.keys(props.recordMap?.block || {});
    const block = props.recordMap?.block?.[keys[0]!]?.value;

    const title = block?.properties?.title?.[0]?.[0] || 'HJ의 기술블로그';
    const description = block?.properties?.description?.[0]?.[0] || props.site?.description || '';
    const image = block?.format?.page_cover || props.site?.image;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        url: `${props.site?.domain}/post/${pageId}`,
        images: image ? [{ url: image }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: image ? [image] : [],
      },
    };
  } catch (err) {
    console.error('❌ Failed to generate metadata for page:', pageId, err);
    return {};
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { pageId } = await params;

  if (!pageId) {
    notFound();
  }

  let props;
  try {
    props = await resolveNotionPage(domain, pageId);
    await increaseNotionView(pageId);
  } catch (err) {
    console.error('❌ Failed to load page:', pageId, err);
    notFound();
  }

  return <NotionPostPageClient {...props} postId={pageId} />;
}
