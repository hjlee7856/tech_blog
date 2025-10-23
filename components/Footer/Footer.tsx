import * as React from 'react';

import styles from '@/styles/styles.module.css';

// TODO: merge the data and icons from PageSocial with the social links in Footer

export function FooterImpl() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.copyright}>
          <p>© {currentYear} HJ All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export const Footer = React.memo(FooterImpl);
