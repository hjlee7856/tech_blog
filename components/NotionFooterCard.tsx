import Image from 'next/image'
import Link from 'next/link'

import styles from './NotionFooterCard.module.css'

export interface NotionFooterCardProps {
  className?: string
}

export function NotionFooterCard({ className }: NotionFooterCardProps) {
  return (
    <div
      className={`${styles.root} ${className ?? ''}`}
      aria-label='데일리언 푸터 배너'
    >
      <div className={styles.imageWrapper}>
        <Image
          src='/post-footer.png'
          alt='데일리언 푸터 배경'
          fill
          className={styles.image}
          priority
          sizes='(max-width: 600px) 100vw, 900px'
        />
        <div className={styles.overlay} aria-hidden='true' />
        <div className={styles.content}>
          <p className={styles.text}>
            우리는 매일 금융의 각을 넓혀가는 데일리언입니다.
          </p>
          <Link
            href='https://linktr.ee/dailyfunding'
            className={styles.link}
            target='_blank'
            rel='noopener noreferrer'
          >
            데일리언과 함께하기&gt;
          </Link>
        </div>
      </div>
    </div>
  )
}
