import React from 'react';

export function PaginationSkeleton() {
  return (
    <nav style={{ display: 'flex', gap: 8, justifyContent: 'center', margin: '2rem 0' }} aria-busy="true" aria-label="페이지네이션 스켈레톤" role="status">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          style={{ minWidth: 32, minHeight: 32, borderRadius: 6, background: 'linear-gradient(90deg, #f5f5f5 25%, #e0e0e0 50%, #f5f5f5 75%)', backgroundSize: '200% 100%', animation: 'skeleton-loading 1.2s infinite linear' }}
        />
      ))}
      <style>{`
        @keyframes skeleton-loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </nav>
  );
}
