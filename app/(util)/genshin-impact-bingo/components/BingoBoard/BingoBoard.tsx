'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { createNameMap } from '../../lib/characterUtils';
import { saveBoard, setReadyFalse } from '../../lib/game';
import { CharacterSelectModal } from '../CharacterSelectModal/CharacterSelectModal';
import {
  Board,
  Button,
  ButtonContainer,
  Cell,
  CellImage,
  CellName,
  ClearButton,
  Container,
  MatchedCell,
} from './BingoBoard.styles';

interface BingoBoardProps {
  characterNames: string[];
  characterEnNames: string[];
  userId: number;
  isGameStarted: boolean;
  drawnNames: string[];
  initialBoard?: string[];
}

export function BingoBoard({
  characterNames,
  characterEnNames,
  userId,
  isGameStarted,
  drawnNames,
  initialBoard,
}: BingoBoardProps) {
  const [board, setBoard] = useState<(string | null)[]>(
    initialBoard?.length === 25
      ? initialBoard
      : Array.from<string | null>({ length: 25 }).fill(null),
  );
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 한글-영어 이름 매핑
  const nameMap = useMemo(
    () => createNameMap(characterNames, characterEnNames),
    [characterNames, characterEnNames],
  );

  const getImagePath = (koreanName: string) => {
    const englishName = nameMap.get(koreanName);
    if (!englishName) return '/genshin-impact/Aino_Avatar.webp';
    const safeName = englishName.replaceAll(' ', '_').replaceAll('%20', '_');
    return `/genshin-impact/${safeName}_Avatar.webp`;
  };

  const usedNames = new Set(
    board.filter((name): name is string => name !== null),
  );
  const availableNames = characterNames.filter((name) => !usedNames.has(name));

  // 보드 변경시 저장 및 준비 상태 체크
  useEffect(() => {
    const validBoard = board.filter((name): name is string => name !== null);
    // 항상 현재 보드 상태 저장
    void saveBoard(userId, validBoard);

    // 25개 미만이면 준비 상태 해제
    if (validBoard.length < 25) {
      void setReadyFalse(userId);
    }
  }, [board, userId]);

  const handleCellClick = (index: number) => {
    if (isGameStarted) return; // 게임 시작 후 수정 불가
    setSelectedCell(index);
    setIsModalOpen(true);
  };

  const handleSelectCharacter = (name: string) => {
    if (selectedCell === null || isGameStarted) return;
    setBoard((prev) => {
      const newBoard = [...prev];
      newBoard[selectedCell] = name;
      return newBoard;
    });
    setIsModalOpen(false);
    setSelectedCell(null);
  };

  const handleClearCell = () => {
    if (selectedCell === null || isGameStarted) return;
    setBoard((prev) => {
      const newBoard = [...prev];
      newBoard[selectedCell] = null;
      return newBoard;
    });
    setIsModalOpen(false);
    setSelectedCell(null);
  };

  const handleRandomFill = () => {
    if (isGameStarted) return;
    const shuffled = [...characterNames].toSorted(() => Math.random() - 0.5);
    setBoard(shuffled.slice(0, 25));
  };

  const handleClearAll = () => {
    if (isGameStarted) return;
    setBoard(Array.from<string | null>({ length: 25 }).fill(null));
  };

  const isMatched = (name: string | null) => {
    return name !== null && drawnNames.includes(name);
  };

  return (
    <Container>
      {!isGameStarted && (
        <ButtonContainer>
          <Button onClick={handleRandomFill}>랜덤 채우기</Button>
          <ClearButton onClick={handleClearAll}>전체 초기화</ClearButton>
        </ButtonContainer>
      )}

      <Board>
        {board.map((name, index) =>
          isMatched(name) ? (
            <MatchedCell key={index}>
              {name && (
                <>
                  <CellImage>
                    <Image
                      src={getImagePath(name)}
                      alt={name}
                      width={48}
                      height={48}
                      style={{ objectFit: 'cover' }}
                    />
                  </CellImage>
                  <CellName>{name}</CellName>
                </>
              )}
            </MatchedCell>
          ) : (
            <Cell
              key={index}
              onClick={() => handleCellClick(index)}
              style={{ cursor: isGameStarted ? 'default' : 'pointer' }}
            >
              {name ? (
                <>
                  <CellImage>
                    <Image
                      src={getImagePath(name)}
                      alt={name}
                      width={48}
                      height={48}
                      style={{ objectFit: 'cover' }}
                    />
                  </CellImage>
                  <CellName>{name}</CellName>
                </>
              ) : (
                ''
              )}
            </Cell>
          ),
        )}
      </Board>

      {!isGameStarted && (
        <CharacterSelectModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCell(null);
          }}
          availableNames={availableNames}
          currentName={
            selectedCell !== null ? (board[selectedCell] ?? null) : null
          }
          onSelect={handleSelectCharacter}
          onClear={handleClearCell}
          nameMap={nameMap}
        />
      )}
    </Container>
  );
}
