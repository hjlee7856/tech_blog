'use client';

import type { PageProps } from '@/lib/types';
import { NotionPostPage } from 'app/post/[pageId]/components/NotionPostPage';

interface NotionPostPageClientProps extends PageProps {
  postId?: string;
}

export function NotionPostPageClient({ ...props }: NotionPostPageClientProps) {
  return (
    <div className="post">
      <NotionPostPage {...props} />
    </div>
  );
}
