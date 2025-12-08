'use client';

import { css } from '@/styled-system/css';
import { useEffect, useRef, useState } from 'react';

interface AdminMenuProps {
  isGameStarted: boolean;
  onForceStart: () => void;
  onResetGame: () => void;
  onSkipTurn: () => void;
  canForceStart: boolean;
}

export function AdminMenu({
  isGameStarted,
  onForceStart,
  onResetGame,
  onSkipTurn,
  canForceStart,
}: AdminMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={menuRef}
      className={css({
        position: 'fixed',
        top: '8px',
        left: '8px',
        zIndex: 100,
        md: {
          top: '20px',
          left: '20px',
        },
      })}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={css({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          backgroundColor: '#5865F2',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '20px',
          transition: 'all 0.2s',
          _hover: {
            backgroundColor: '#4752C4',
            transform: 'scale(1.05)',
          },
          _active: {
            transform: 'scale(0.95)',
          },
        })}
        title="관리자 메뉴"
      >
        ⚙️
      </button>

      {isOpen && (
        <div
          className={css({
            position: 'absolute',
            top: '48px',
            left: 0,
            backgroundColor: '#2B2D31',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            overflow: 'hidden',
            minWidth: '180px',
          })}
        >
          {!isGameStarted && (
            <button
              onClick={() => {
                onForceStart();
                setIsOpen(false);
              }}
              disabled={!canForceStart}
              className={css({
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'transparent',
                color: canForceStart ? 'white' : '#6B6F76',
                border: 'none',
                textAlign: 'left',
                cursor: canForceStart ? 'pointer' : 'not-allowed',
                fontSize: '14px',
                transition: 'background-color 0.2s',
                _hover: canForceStart
                  ? {
                      backgroundColor: '#3F4147',
                    }
                  : {},
              })}
            >
              🚀 강제 시작
            </button>
          )}

          {isGameStarted && (
            <button
              onClick={() => {
                onSkipTurn();
                setIsOpen(false);
              }}
              className={css({
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'transparent',
                color: 'white',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'background-color 0.2s',
                _hover: {
                  backgroundColor: '#3F4147',
                },
              })}
            >
              ⏭️ 턴 넘기기
            </button>
          )}

          <button
            onClick={() => {
              onResetGame();
              setIsOpen(false);
            }}
            className={css({
              width: '100%',
              padding: '12px 16px',
              backgroundColor: 'transparent',
              color: '#ED4245',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'background-color 0.2s',
              borderTop: '1px solid #3F4147',
              _hover: {
                backgroundColor: '#3F4147',
              },
            })}
          >
            🔄 게임 초기화
          </button>
        </div>
      )}
    </div>
  );
}
