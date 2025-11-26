'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { createNameMap } from '../../lib/characterUtils';
import { saveBoard, setReadyFalse } from '../../lib/game';
import { CharacterSelectModal } from '../CharacterSelectModal/CharacterSelectModal';
import {
  BingoLineCell,
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

  // 완성된 빙고 라인에 포함된 셀 인덱스 계산
  const bingoLineCells = useMemo(() => {
    // 빙고 라인 정의 (5x5 보드)
    const BINGO_LINES = [
      // 가로
      [0, 1, 2, 3, 4],
      [5, 6, 7, 8, 9],
      [10, 11, 12, 13, 14],
      [15, 16, 17, 18, 19],
      [20, 21, 22, 23, 24],
      // 세로
      [0, 5, 10, 15, 20],
      [1, 6, 11, 16, 21],
      [2, 7, 12, 17, 22],
      [3, 8, 13, 18, 23],
      [4, 9, 14, 19, 24],
      // 대각선
      [0, 6, 12, 18, 24],
      [4, 8, 12, 16, 20],
    ];

    const cells = new Set<number>();
    for (const line of BINGO_LINES) {
      const isLineComplete = line.every((idx) => {
        const name = board[idx];
        return name !== null && name !== undefined && drawnNames.includes(name);
      });
      if (isLineComplete) {
        for (const idx of line) cells.add(idx);
      }
    }
    return cells;
  }, [board, drawnNames]);

  const isMatched = (name: string | null) => {
    return name !== null && drawnNames.includes(name);
  };

  const isInBingoLine = (index: number) => bingoLineCells.has(index);

  return (
    <Container>
      {!isGameStarted && (
        <ButtonContainer>
          <Button onClick={handleRandomFill}>랜덤 채우기</Button>
          <ClearButton onClick={handleClearAll}>전체 초기화</ClearButton>
        </ButtonContainer>
      )}

      <Board>
        {board.map((name, index) => {
          const matched = isMatched(name);
          const inBingoLine = isInBingoLine(index);

          // 빙고 줄에 포함된 셀 (금색)
          if (matched && inBingoLine) {
            return (
              <BingoLineCell key={index}>
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
              </BingoLineCell>
            );
          }

          // 매칭된 셀 (초록색)
          if (matched) {
            return (
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
            );
          }

          // 일반 셀
          return (
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
          );
        })}
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
