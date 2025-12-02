'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createNameMap } from '../../lib/characterUtils';
import { getPlayerBoard, saveBoard, setReadyFalse } from '../../lib/game';
import { CharacterSelectModal } from '../CharacterSelectModal/CharacterSelectModal';
import {
  AllMatchedCell,
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
  playerOrder?: number; // 플레이어의 게임 참여 순서 (0이면 미참여)
}

export function BingoBoard({
  characterNames,
  characterEnNames,
  userId,
  isGameStarted,
  drawnNames,
  initialBoard,
  playerOrder = 0,
}: BingoBoardProps) {
  // 초기값은 빈 보드로 시작, DB에서 로드 후 업데이트
  const [board, setBoard] = useState<(string | null)[]>(
    Array.from<string | null>({ length: 25 }).fill(null),
  );
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // 이전 userId를 추적하여 변경 시 재로드
  const prevUserIdRef = useRef<number | null>(null);

  // 컴포넌트 마운트 시 또는 userId 변경 시 DB에서 보드 로드
  useEffect(() => {
    // userId가 변경되면 재로드 필요
    if (prevUserIdRef.current !== null && prevUserIdRef.current !== userId) {
      setIsLoaded(false);
    }
    prevUserIdRef.current = userId;

    if (isLoaded) return;

    let isCancelled = false;

    const loadBoard = async () => {
      const savedBoard: string[] = await getPlayerBoard(userId);
      if (isCancelled) return;

      if (savedBoard.length === 25) {
        setBoard(savedBoard);
      } else if (savedBoard.length > 0) {
        // 부분적으로 저장된 보드가 있으면 복원
        const newBoard: (string | null)[] = Array.from<string | null>({
          length: 25,
        }).fill(null);
        for (const [idx, name] of savedBoard.entries()) {
          if (idx < 25) newBoard[idx] = name;
        }
        setBoard(newBoard);
      } else if (initialBoard?.length === 25) {
        // DB에 저장된 보드가 없으면 initialBoard 사용
        setBoard(initialBoard);
      }
      setIsLoaded(true);
    };
    void loadBoard();

    return () => {
      isCancelled = true;
    };
  }, [userId, isLoaded, initialBoard]);

  // 한글-영어 이름 매핑
  const nameMap = useMemo(
    () => createNameMap(characterNames, characterEnNames),
    [characterNames, characterEnNames],
  );

  const getImagePath = useCallback(
    (koreanName: string) => {
      const englishName = nameMap.get(koreanName);
      if (!englishName) return '/genshin-impact/Aino_Avatar.webp';
      const safeName = englishName.replaceAll(' ', '_').replaceAll('%20', '_');
      return `/genshin-impact/${safeName}_Avatar.webp`;
    },
    [nameMap],
  );

  const usedNames = new Set(
    board.filter((name): name is string => name !== null),
  );
  const availableNames = characterNames.filter((name) => !usedNames.has(name));

  // 보드 변경시 저장 및 준비 상태 체크 (로드 완료 후에만)
  useEffect(() => {
    // 로드 전에는 저장하지 않음 (빈 보드로 덮어쓰기 방지)
    if (!isLoaded) return;

    const validBoard = board.filter((name): name is string => name !== null);
    // 항상 현재 보드 상태 저장
    void saveBoard(userId, validBoard);

    // 25개 미만이면 준비 상태 해제
    if (validBoard.length < 25) {
      void setReadyFalse(userId);
    }
  }, [board, userId, isLoaded]);

  // 게임 참여 전(order === 0)이면 게임 중에도 보드 수정 가능
  const canEditBoard = !isGameStarted || playerOrder === 0;

  const handleCellClick = useCallback(
    (index: number) => {
      if (!canEditBoard) return;
      setSelectedCell(index);
      setIsModalOpen(true);
    },
    [canEditBoard],
  );

  const handleSelectCharacter = useCallback(
    (name: string) => {
      if (selectedCell === null || !canEditBoard) return;
      setBoard((prev) => {
        const newBoard = [...prev];
        newBoard[selectedCell] = name;
        return newBoard;
      });
      setIsModalOpen(false);
      setSelectedCell(null);
    },
    [selectedCell, canEditBoard],
  );

  const handleClearCell = useCallback(() => {
    if (selectedCell === null || !canEditBoard) return;
    setBoard((prev) => {
      const newBoard = [...prev];
      newBoard[selectedCell] = null;
      return newBoard;
    });
    setIsModalOpen(false);
    setSelectedCell(null);
  }, [selectedCell, canEditBoard]);

  const handleRandomFill = useCallback(() => {
    if (!canEditBoard) return;
    const shuffled = [...characterNames].toSorted(() => Math.random() - 0.5);
    setBoard(shuffled.slice(0, 25));
  }, [canEditBoard, characterNames]);

  const handleClearAll = useCallback(() => {
    if (!canEditBoard) return;
    setBoard(Array.from<string | null>({ length: 25 }).fill(null));
  }, [canEditBoard]);

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

  const isMatched = useCallback(
    (name: string | null) => {
      return name !== null && drawnNames.includes(name);
    },
    [drawnNames],
  );

  const isInBingoLine = (index: number) => bingoLineCells.has(index);

  // 모든 셀이 매칭되었는지 확인
  const isAllMatched = useMemo(() => {
    const filledCells = board.filter((n) => n !== null);
    if (filledCells.length !== 25) return false;
    return filledCells.every((name) => drawnNames.includes(name as string));
  }, [board, drawnNames]);

  return (
    <Container>
      {canEditBoard && (
        <ButtonContainer>
          <Button onClick={handleRandomFill}>랜덤 채우기</Button>
          <ClearButton onClick={handleClearAll}>전체 초기화</ClearButton>
        </ButtonContainer>
      )}

      <Board>
        {board.map((name, index) => {
          const matched = isMatched(name);
          const inBingoLine = isInBingoLine(index);

          // 모든 셀이 매칭되었을 때 (빨간색 네온)
          if (isAllMatched && matched) {
            return (
              <AllMatchedCell key={index}>
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
              </AllMatchedCell>
            );
          }

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
              style={{ cursor: canEditBoard ? 'pointer' : 'default' }}
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

      {canEditBoard && (
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
