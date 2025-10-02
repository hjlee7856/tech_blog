import Image from 'next/image';
import Link from 'next/link';

import styles from './NotionFooterCard.module.css';

export interface NotionFooterCardProps {
  className?: string;
}

export function NotionFooterCard({ className }: NotionFooterCardProps) {
  return (
    <div className={`${styles.root} ${className ?? ''}`} aria-label="데일리언 푸터 배너">
      <div className={styles.imageWrapper}>
        <Image
          src="/post-footer.png"
          alt="데일리언 푸터 배경"
          fill
          className={styles.image}
          priority
          sizes="(max-width: 600px) 100vw, 900px"
        />
        <div className={styles.overlay} aria-hidden="true" />
      </div>
    </div>
  );
}
