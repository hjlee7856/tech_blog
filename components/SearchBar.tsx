import { FaSearch } from '@react-icons/all-files/fa/FaSearch';
import React from 'react';

import styles from './SearchBar.module.css';

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  loading?: boolean;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  onKeyDown,
  loading = false,
  placeholder = '제목 / 소개글 검색',
}: SearchBarProps) {
  return (
    <div className={styles.searchBarContainer}>
      <div className={styles.searchInputContainer}>
        <button
          onClick={onSearch}
          className={styles.searchButton}
          disabled={loading}
          aria-label="검색"
        >
          <FaSearch color="#94a3b8" />
        </button>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          className={styles.searchInput}
          disabled={loading}
        />
      </div>
    </div>
  );
}
