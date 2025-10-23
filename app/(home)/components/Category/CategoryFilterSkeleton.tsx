import React from 'react';

import skeletonStyles from './CategoryFilterSkeleton.module.css';
import notionCategoryFilterStyles from './NotionCategoryFilter.module.css';

export function CategoryFilterSkeleton() {
  return (
    <div
      className={notionCategoryFilterStyles.categoryFilter}
      aria-busy="true"
      aria-label="카테고리 스켈레톤"
      role="status"
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className={skeletonStyles.skeletonItem} />
      ))}
    </div>
  );
}
