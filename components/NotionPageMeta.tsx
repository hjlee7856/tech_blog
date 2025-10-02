import Head from 'next/head';

import * as config from '@/lib/config';

export function NotionPageMeta({
  title,
  description,
  image,
  url,
}: {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}) {
  const rssFeedUrl = `${config.host}/feed`;

  const socialImageUrl = image;

  return (
    <Head>
      <meta charSet="utf-8" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
      />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />

      <meta name="naver-site-verification" content="2f61fdf4590af385c57fb28be49607a2fe001634" />
      <meta name="google-site-verification" content="YpmUsQSU8LG8vsWZBSpR75b0Hl3fiEr_PqRbget7qMk" />
      <meta
        name="theme-color"
        media="(prefers-color-scheme: light)"
        content="#fefffe"
        key="theme-color-light"
      />

      <meta
        name="theme-color"
        media="(prefers-color-scheme: dark)"
        content="#2d3439"
        key="theme-color-dark"
      />

      <meta name="robots" content="index,follow" />
      <meta property="og:type" content="website" />

      {title && (
        <>
          <meta property="og:title" content={title} />
          <meta name="twitter:title" content={title} />
          <title>{title}</title>
        </>
      )}

      {description && (
        <>
          <meta name="description" content={description} />
          <meta property="og:description" content={description} />
          <meta name="twitter:description" content={description} />
        </>
      )}

      {config.twitter && <meta name="twitter:creator" content={`@${config.twitter}`} />}

      {socialImageUrl ? (
        <>
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content={socialImageUrl} />
          <meta property="og:image" content={socialImageUrl} />
        </>
      ) : (
        <meta name="twitter:card" content="summary" />
      )}

      {url && (
        <>
          <link rel="canonical" href={url} />
          <meta property="og:url" content={url} />
          <meta property="twitter:url" content={url} />
        </>
      )}

      <link rel="alternate" type="application/rss+xml" href={rssFeedUrl} title={title} />
      <link
        href="https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&amp;display=swap"
        rel="stylesheet"
        type="text/css"
      ></link>
    </Head>
  );
}
