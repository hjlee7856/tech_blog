import { useRouter } from 'next/router';
import React from 'react';

import styles from './PostOverlay.module.css';

interface PostOverlayProps {
  title: string;
  subtitle?: string;
  category?: string;
  className?: string; // height 등 부모에서 조절할 수 있게
  preview?: boolean;
}

/**
 * 화면 중앙에 제목, 부제목, 카테고리를 오버레이로 표시하는 컴포넌트
 * - width: 100%, height: 부모에서 제어
 * - 배경은 투명/반투명, 내용은 세로 중앙 정렬
 */
export function PostOverlay({ title, subtitle, category, className, preview }: PostOverlayProps) {
  const router = useRouter();

  const handleCategoryClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (category) {
      void router.push(`${preview ? '/preview' : ''}/?category=${encodeURIComponent(category)}`);
    }
  };

  return (
    <div
      className={[styles.postOverlay, className].filter(Boolean).join(' ')}
      aria-modal="true"
      role="dialog"
    >
      <div className={styles.postOverlayContent}>
        {category && (
          <button
            type="button"
            className={styles.postOverlayCategory}
            onClick={handleCategoryClick}
            tabIndex={0}
            aria-label={`카테고리 ${category}로 이동`}
          >
            {category}
          </button>
        )}
        <h1 className={styles.postOverlayTitle}>{title}</h1>
        {subtitle && <h2 className={styles.postOverlaySubtitle}>{subtitle}</h2>}
      </div>
    </div>
  );
}
