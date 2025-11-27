'use client';

import { ModalContent, ModalOverlay, ModalTitle } from '../BingoGame.styles';

interface AloneModalProps {
  isOpen: boolean;
}

export function AloneModal({ isOpen }: AloneModalProps) {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>게임 종료</ModalTitle>
        <p style={{ color: '#FAA61A' }}>
          다른 플레이어가 모두 나갔습니다. 게임이 초기화됩니다.
        </p>
      </ModalContent>
    </ModalOverlay>
  );
}
