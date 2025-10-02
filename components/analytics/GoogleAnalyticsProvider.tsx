import Script from 'next/script';
import React from 'react';

export default function GoogleAnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=G-51F9V1QQS4`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-51F9V1QQS4', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      {children}
    </>
  );
}
