'use client';

import Image from 'next/image';
import { useState } from 'react';
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
  SearchInput,
  SelectDrawButton,
} from '../BingoGame.styles';

interface DrawModalProps {
  isOpen: boolean;
  drawnResult: string | null;
  drawMode: 'select' | 'random' | 'list';
  isDrawing: boolean;
  remainingNames: string[];
  myBoardNames: Set<string>;
  nameMap: Map<string, string>;
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
  nameMap,
  onClose,
  onRandomDraw,
  onSelectDraw,
  onSetDrawMode,
}: DrawModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const getImagePath = (koreanName: string) => {
    const englishName = nameMap.get(koreanName);
    if (!englishName) return '/genshin-impact/Aino_Avatar.webp';
    const safeName = englishName.replaceAll(' ', '_').replaceAll('%20', '_');
    return `/genshin-impact/${safeName}_Avatar.webp`;
  };

  if (!isOpen) return null;

  const filteredNames = remainingNames.filter((name) =>
    name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
              이름 선택 ({filteredNames.length}/{remainingNames.length}개)
            </DrawModalTitle>
            <SearchInput
              type="text"
              placeholder="캐릭터 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            <p style={{ fontSize: '12px', color: '#FFD700', margin: 0 }}>
              ⭐ 금색은 내 보드에 있는 이름
            </p>
            <NameSelectGrid>
              {filteredNames.map((name) => (
                <NameSelectItem
                  key={name}
                  isInMyBoard={myBoardNames.has(name)}
                  onClick={() => {
                    onSelectDraw(name);
                    setSearchTerm('');
                  }}
                  disabled={isDrawing}
                >
                  <Image
                    src={getImagePath(name)}
                    alt={name}
                    width={32}
                    height={32}
                    style={{ borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <span>{name}</span>
                </NameSelectItem>
              ))}
            </NameSelectGrid>
            <CancelDrawButton
              onClick={() => {
                onSetDrawMode('select');
                setSearchTerm('');
              }}
            >
              뒤로
            </CancelDrawButton>
          </>
        )}
      </DrawModalContent>
    </ModalOverlay>
  );
}
