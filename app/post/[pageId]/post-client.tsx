'use client';

import type { PageProps } from '@/lib/types';
import { useDarkMode } from '@/lib/use-dark-mode';
import { NotionPostPage } from 'app/post/[pageId]/components/NotionPostPage';

interface NotionPostPageClientProps extends PageProps {
  postId?: string;
}

export function NotionPostPageClient({ ...props }: NotionPostPageClientProps) {
  const { isDarkMode } = useDarkMode();

  return (
    <div className="post">
      <NotionPostPage {...props} isDarkMode={isDarkMode} />
    </div>
  );
}
