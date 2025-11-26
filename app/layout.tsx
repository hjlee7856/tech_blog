import 'katex/dist/katex.min.css';
import 'prismjs/themes/prism-coy.css';
import 'react-notion-x/src/styles.css';

import '../styles/global.css';
import '../styles/notion.css';
import '../styles/prism-theme.css';

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" style={{ height: '100%' }}>
      <head />
      <body style={{ height: '100%' }}>{children}</body>
    </html>
  );
}

export default RootLayout;
