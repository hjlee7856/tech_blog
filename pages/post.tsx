'use client';

import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';

import { NotionPostPage } from '@/components/NotionPostPage';
import { domain } from '@/lib/config';
import { resolveNotionPage } from '@/lib/resolve-notion-page';
import { type PageProps } from '@/lib/types';
import { increaseNotionView } from '@/server/increase-notion-view';

// 이 페이지는 이제 /post?post_id=... 요청을 받아 실제 게시물을 렌더링합니다.
export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
  // 미들웨어에서 전달한 헤더 값을 읽습니다.
  const pageId = context.req.headers['x-page-id'] as string | undefined;
  const postId = context.req.headers['x-post-id'] as string | undefined;

  try {
    const props = await resolveNotionPage(domain, pageId);

    // props에 postId를 추가하여 캐노니컬 태그에 사용합니다.
    // PageProps 타입에 postId를 추가해야 할 수 있습니다
    return { props: { ...props, postId: postId || null } };
  } catch (err) {
    console.error('❌ Failed to load page:', pageId, err);
    return { notFound: true };
  }
};

export default function NotionPostPageWrapper(props: PageProps & { postId?: string }) {
  useEffect(() => {
    if (!props.pageId) return;
    void increaseNotionView(props.pageId);
  }, [props.pageId]);

  return (
    <>
      <Head>
        {props.postId && (
          <link
            rel="canonical"
            href={`${props.site?.domain || domain}/post?post_id=${props.postId}`}
          />
        )}
      </Head>
      <div className="post">
        <NotionPostPage {...props} />
      </div>
    </>
  );
}
