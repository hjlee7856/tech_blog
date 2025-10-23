'use client';

import { useState } from 'react';
import { FaRegShareSquare } from 'react-icons/fa';

// ... (기존 import 및 함수 선언부는 동일)
export function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('복사에 실패했습니다.');
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={handleCopy}
        aria-label="현재 주소 복사"
        style={{
          display: 'flex',
          alignItems: 'center',
          border: '1px solid #bdbdbd',
          borderRadius: '999px',
          padding: '6px 18px',
          background: 'white',
          cursor: 'pointer',
          fontSize: 16,
          color: '#757575',
          gap: 8,
          transition: 'border 0.2s',
          margin: '0 4px',
          marginBottom: '16px',
        }}
      >
        <FaRegShareSquare />
        <span>공유</span>
      </button>
      {copied && (
        <div
          style={{
            position: 'fixed',
            left: '50%',
            bottom: 32,
            transform: 'translateX(-50%)',
            background: '#222',
            color: '#fff',
            padding: '14px 21px',
            borderRadius: 16,
            boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
            fontSize: 16,
            fontWeight: 500,
            zIndex: 10_000,
            minWidth: 300,
            textAlign: 'center',
            pointerEvents: 'none',
            transition: 'opacity 0.2s',
          }}
          role="status"
          aria-live="polite"
        >
          클립보드에 복사되었습니다.
        </div>
      )}
    </div>
  );
}
