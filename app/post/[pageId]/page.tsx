import { notFound } from 'next/navigation';

import { domain } from '@/lib/config';
import { resolveNotionPage } from '@/lib/resolve-notion-page';
import { increaseNotionView } from '@/server/increase-notion-view';
import { NotionPostPageClient } from './post-client';

interface PostPageProps {
  params: Promise<{ pageId: string }>;
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
