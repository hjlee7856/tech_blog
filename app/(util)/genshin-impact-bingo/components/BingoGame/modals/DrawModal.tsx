'use client';

import {
  CancelDrawButton,
  DrawModalButtons,
  DrawModalContent,
  DrawModalTitle,
  DrawnResultName,
  ModalOverlay,
  NameSelectGrid,
  NameSelectItem,
  RandomDrawButton,
  SelectDrawButton,
} from '../BingoGame.styles';

interface DrawModalProps {
  isOpen: boolean;
  drawnResult: string | null;
  drawMode: 'select' | 'random' | 'list';
  isDrawing: boolean;
  remainingNames: string[];
  myBoardNames: Set<string>;
  onClose: () => void;
  onRandomDraw: () => void;
  onSelectDraw: (name: string) => void;
  onSetDrawMode: (mode: 'select' | 'random' | 'list') => void;
}

export function DrawModal({
  isOpen,
  drawnResult,
  drawMode,
  isDrawing,
  remainingNames,
  myBoardNames,
  onClose,
  onRandomDraw,
  onSelectDraw,
  onSetDrawMode,
}: DrawModalProps) {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <DrawModalContent onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        {drawnResult ? (
          <>
            <DrawModalTitle>뽑은 이름</DrawModalTitle>
            <DrawnResultName style={{ fontSize: '32px' }}>
              {drawnResult}
            </DrawnResultName>
            <CancelDrawButton onClick={onClose}>닫기</CancelDrawButton>
          </>
        ) : drawMode === 'select' ? (
          <>
            <DrawModalTitle>당신의 차례입니다!</DrawModalTitle>
            <DrawModalButtons>
              <RandomDrawButton onClick={onRandomDraw} disabled={isDrawing}>
                {isDrawing ? '뽑는 중...' : '랜덤으로 뽑기'}
              </RandomDrawButton>
              <SelectDrawButton
                onClick={() => onSetDrawMode('list')}
                disabled={isDrawing}
              >
                선택해서 뽑기
              </SelectDrawButton>
            </DrawModalButtons>
          </>
        ) : (
          <>
            <DrawModalTitle>
              이름 선택 ({remainingNames.length}개 남음)
            </DrawModalTitle>
            <p style={{ fontSize: '12px', color: '#FFD700', margin: 0 }}>
              ⭐ 금색은 내 보드에 있는 이름
            </p>
            <NameSelectGrid>
              {remainingNames.map((name) => (
                <NameSelectItem
                  key={name}
                  isInMyBoard={myBoardNames.has(name)}
                  onClick={() => onSelectDraw(name)}
                  disabled={isDrawing}
                >
                  {name}
                </NameSelectItem>
              ))}
            </NameSelectGrid>
            <CancelDrawButton onClick={() => onSetDrawMode('select')}>
              뒤로
            </CancelDrawButton>
          </>
        )}
      </DrawModalContent>
    </ModalOverlay>
  );
}
