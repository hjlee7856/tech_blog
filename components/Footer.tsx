import Link from 'next/link';
import * as React from 'react';

import * as config from '@/lib/config';

import styles from './styles.module.css';

// TODO: merge the data and icons from PageSocial with the social links in Footer

export function FooterImpl() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.copyright}>
          <p>
            © {currentYear} {config.author}. All rights reserved.
          </p>
          <div>모든 콘텐츠의 저작권은 데일리펀딩에 있습니다.</div>
        </div>

        <Link href="https://dailyfunding.oopy.io/" target="_blank">
          <div style={{ textAlign: 'center', color: 'rgb(102, 102, 102)' }}>
            <div className={styles.linkText}>데일리펀딩의 일하는 방식이 궁금하다면?</div>
            <div className={styles.linkTitle}>인재 채용 바로가기</div>
          </div>
        </Link>
      </div>
    </footer>
  );
}

export const Footer = React.memo(FooterImpl);
