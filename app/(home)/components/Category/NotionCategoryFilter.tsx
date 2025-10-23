import { CategoryFilterSkeleton } from './CategoryFilterSkeleton';
import styles from './NotionCategoryFilter.module.css';

interface NotionCategoryFilterProps {
  onCategoryChange: (category: string) => Promise<void>;
  activeCategory: string;
  categories: string[];
}

export function NotionCategoryFilter({
  onCategoryChange,
  activeCategory,
  categories,
}: NotionCategoryFilterProps) {
  if (!categories || categories.length === 0) {
    return <CategoryFilterSkeleton />;
  }

  return (
    <div className={styles.categoryFilter}>
      <button
        className={`${styles.categoryButton} ${activeCategory === '전체' ? styles.active : ''}`}
        onClick={() => onCategoryChange('전체')}
      >
        전체
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          className={`${styles.categoryButton} ${activeCategory === cat ? styles.active : ''}`}
          onClick={() => onCategoryChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
