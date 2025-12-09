'use client';

import { css } from '@/styled-system/css';
import { useState } from 'react';
import { updateNickname } from '../../lib/auth';

interface NicknameChangeModalProps {
  isOpen: boolean;
  userId: number;
  currentName: string;
  onClose: () => void;
  onSuccess: (newName: string) => void;
}

export function NicknameChangeModal({
  isOpen,
  userId,
  currentName,
  onClose,
  onSuccess,
}: NicknameChangeModalProps) {
  const [newName, setNewName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newName.trim()) {
      setError('닉네임을 입력해주세요.');
      return;
    }

    if (newName.trim() === currentName) {
      setError('현재 닉네임과 동일합니다.');
      return;
    }

    if (!password) {
      setError('비밀번호를 입력해주세요.');
      return;
    }

    setIsProcessing(true);
    const result = await updateNickname(userId, newName.trim(), password);
    setIsProcessing(false);

    if (result.success) {
      onSuccess(newName.trim());
      setNewName('');
      setPassword('');
      onClose();
    } else {
      setError(result.error || '닉네임 변경에 실패했습니다.');
    }
  };

  const handleClose = () => {
    setNewName('');
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <div
      className={css({
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      })}
      onClick={handleClose}
    >
      <div
        className={css({
          backgroundColor: '#2B2D31',
          borderRadius: '8px',
          padding: '24px',
          width: '90%',
          maxWidth: '400px',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
        })}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <h2
          className={css({
            fontSize: '20px',
            fontWeight: 700,
            color: '#F2F3F5',
            marginBottom: '20px',
            textAlign: 'center',
          })}
        >
          닉네임 변경
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="current-name"
              style={{
                display: 'block',
                marginBottom: '8px',
                color: '#B5BAC1',
                fontSize: '14px',
              }}
            >
              현재 닉네임
            </label>
            <input
              id="current-name"
              type="text"
              value={currentName}
              disabled
              className={css({
                width: '100%',
                padding: '10px 12px',
                backgroundColor: '#1E1F22',
                border: '1px solid #3F4147',
                borderRadius: '4px',
                color: '#F2F3F5',
                fontSize: '14px',
                outline: 'none',
                opacity: 0.6,
                cursor: 'not-allowed',
              })}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="new-name"
              style={{
                display: 'block',
                marginBottom: '8px',
                color: '#B5BAC1',
                fontSize: '14px',
              }}
            >
              새 닉네임
            </label>
            <input
              id="new-name"
              type="text"
              value={newName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewName(e.target.value)
              }
              placeholder="새 닉네임을 입력하세요"
              autoFocus
              className={css({
                width: '100%',
                padding: '10px 12px',
                backgroundColor: '#1E1F22',
                border: '1px solid #3F4147',
                borderRadius: '4px',
                color: '#F2F3F5',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s',
                _focus: {
                  borderColor: '#5865F2',
                },
              })}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                marginBottom: '8px',
                color: '#B5BAC1',
                fontSize: '14px',
              }}
            >
              비밀번호 확인
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              placeholder="비밀번호를 입력하세요"
              className={css({
                width: '100%',
                padding: '10px 12px',
                backgroundColor: '#1E1F22',
                border: '1px solid #3F4147',
                borderRadius: '4px',
                color: '#F2F3F5',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s',
                _focus: {
                  borderColor: '#5865F2',
                },
              })}
            />
          </div>

          {error && (
            <div
              className={css({
                color: '#F23F42',
                fontSize: '14px',
                marginBottom: '16px',
                textAlign: 'center',
              })}
            >
              {error}
            </div>
          )}

          <div
            className={css({
              display: 'flex',
              gap: '12px',
              marginTop: '20px',
            })}
          >
            <button
              type="button"
              onClick={handleClose}
              disabled={isProcessing}
              className={css({
                flex: 1,
                padding: '10px 16px',
                backgroundColor: '#3F4147',
                color: '#F2F3F5',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                _hover: {
                  backgroundColor: '#4E5058',
                },
                _disabled: {
                  opacity: 0.5,
                  cursor: 'not-allowed',
                },
              })}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className={css({
                flex: 1,
                padding: '10px 16px',
                backgroundColor: '#5865F2',
                color: '#F2F3F5',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                _hover: {
                  backgroundColor: '#4752C4',
                },
                _disabled: {
                  opacity: 0.5,
                  cursor: 'not-allowed',
                },
              })}
            >
              {isProcessing ? '변경 중...' : '변경'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
