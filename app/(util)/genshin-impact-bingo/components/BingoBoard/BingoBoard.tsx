'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createNameMap } from '../../lib/characterUtils';
import {
  getPlayerBoard,
  saveBoard,
  setReadyFalse,
  subscribeToPlayerBoard,
} from '../../lib/game';
import { CharacterSelectModal } from '../CharacterSelectModal/CharacterSelectModal';
import {
  AllMatchedCell,
  BingoLineCell,
  Board,
  CancelButton,
  Cell,
  CellImage,
  CellName,
  ConfirmButton,
  Container,
  DrawConfirmButtons,
  DrawConfirmSection,
  DrawConfirmText,
  MatchedCell,
  SelectableCell,
  SelectedForDrawCell,
} from './BingoBoard.styles';

export interface BingoBoardActions {
  fillRandom: () => void;
  clearAll: () => void;
}

interface BingoBoardProps {
  characterNames: string[];
  characterEnNames: string[];
  userId: number;
  isGameStarted: boolean;
  drawnNames: string[];
  playerOrder?: number; // 플레이어의 게임 참여 순서 (0이면 미참여)
  isMyTurn?: boolean; // 내 턴인지 여부
  isDrawing?: boolean; // 뽑기 진행 중인지
  onSelectForDraw?: (name: string) => void; // 뽑기용 선택 콜백
  onRegisterActions?: (actions: BingoBoardActions | null) => void;
}

export function BingoBoard({
  characterNames,
  characterEnNames,
  userId,
  isGameStarted,
  drawnNames,
  playerOrder = 0,
  isMyTurn = false,
  isDrawing = false,
  onSelectForDraw,
  onRegisterActions,
}: BingoBoardProps) {
  // 초기값은 빈 보드로 시작, DB에서 로드 후 업데이트
  const [board, setBoard] = useState<(string | null)[]>(
    Array.from<string | null>({ length: 25 }).fill(null),
  );
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedForDraw, setSelectedForDraw] = useState<string | null>(null);

  // 로컬/서버 동기화 상태 관리
  const isApplyingLocalChangeRef = useRef(false);
  const isSyncingFromServerRef = useRef(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 이전 userId를 추적하여 변경 시 재로드
  const prevUserIdRef = useRef<number | null>(null);

  const applyBoardUpdate = useCallback(
    (updater: (prev: (string | null)[]) => (string | null)[]) => {
      isApplyingLocalChangeRef.current = true;
      setBoard((prev) => updater([...prev]));
    },
    [],
  );

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
        isSyncingFromServerRef.current = true;
        setBoard(savedBoard);
      } else if (savedBoard.length > 0) {
        // 부분적으로 저장된 보드가 있으면 복원
        const newBoard: (string | null)[] = Array.from<string | null>({
          length: 25,
        }).fill(null);
        for (const [idx, name] of savedBoard.entries()) {
          if (idx < 25) newBoard[idx] = name;
        }
        isSyncingFromServerRef.current = true;
        setBoard(newBoard);
      } else {
        // DB에 보드가 없으면 로컬도 초기화
        isSyncingFromServerRef.current = true;
        setBoard(Array.from<string | null>({ length: 25 }).fill(null));
      }
      setIsLoaded(true);
    };
    void loadBoard();

    return () => {
      isCancelled = true;
    };
  }, [userId, isLoaded]);

  // 플레이어 보드 변경 구독 (게임 초기화 시 보드 리셋 감지)
  useEffect(() => {
    const subscription = subscribeToPlayerBoard(userId, (newBoard) => {
      if (isApplyingLocalChangeRef.current) return;

      isSyncingFromServerRef.current = true;

      if (newBoard.length === 0) {
        // 보드가 초기화되면 로컬도 초기화
        setBoard(Array.from<string | null>({ length: 25 }).fill(null));
        setIsLoaded(false);
        return;
      }

      if (newBoard.length === 25) {
        setBoard(newBoard);
        return;
      }

      const partialBoard: (string | null)[] = Array.from<string | null>({
        length: 25,
      }).fill(null);
      for (const [idx, name] of newBoard.entries()) {
        if (idx < 25) partialBoard[idx] = name;
      }
      setBoard(partialBoard);
    });

    return () => {
      void subscription.unsubscribe();
    };
  }, [userId]);

  // 보드 변경시 저장 및 준비 상태 체크 (로드 완료 후에만, debounce 적용)
  useEffect(() => {
    if (!isLoaded) return;

    if (isSyncingFromServerRef.current) {
      isSyncingFromServerRef.current = false;
      return;
    }

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    const timeoutId = setTimeout(() => {
      void (async () => {
        const validBoard = board.filter(
          (name): name is string => name !== null,
        );
        await saveBoard(userId, validBoard);

        if (validBoard.length < 25) {
          await setReadyFalse(userId);
        }

        isApplyingLocalChangeRef.current = false;
        saveTimeoutRef.current = null;
      })();
    }, 200);

    saveTimeoutRef.current = timeoutId;

    return () => {
      clearTimeout(timeoutId);
    };
  }, [board, userId, isLoaded]);

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
      applyBoardUpdate((prev) => {
        const next = [...prev];
        next[selectedCell] = name;
        return next;
      });
      setIsModalOpen(false);
      setSelectedCell(null);
    },
    [selectedCell, canEditBoard, applyBoardUpdate],
  );

  const handleClearCell = useCallback(() => {
    if (selectedCell === null || !canEditBoard) return;
    applyBoardUpdate((prev) => {
      const next = [...prev];
      next[selectedCell] = null;
      return next;
    });
    setIsModalOpen(false);
    setSelectedCell(null);
  }, [selectedCell, canEditBoard, applyBoardUpdate]);

  const handleRandomFill = useCallback(() => {
    if (!canEditBoard) return;
    const shuffled = [...characterNames].toSorted(() => Math.random() - 0.5);
    applyBoardUpdate(() => shuffled.slice(0, 25));
  }, [canEditBoard, characterNames, applyBoardUpdate]);

  const handleClearAll = useCallback(() => {
    if (!canEditBoard) return;
    applyBoardUpdate(() =>
      Array.from<string | null>({ length: 25 }).fill(null),
    );
  }, [canEditBoard, applyBoardUpdate]);

  // 액션 등록 (부모 컴포넌트에서 사용)
  useEffect(() => {
    if (!onRegisterActions) return;
    onRegisterActions({
      fillRandom: handleRandomFill,
      clearAll: handleClearAll,
    });
    return () => onRegisterActions(null);
  }, [handleRandomFill, handleClearAll, onRegisterActions]);

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

          // 내 턴이고 아직 뽑히지 않은 셀 - 선택 가능
          const canSelectForDraw =
            isMyTurn && !isDrawing && name && !drawnNames.includes(name);

          // 선택된 셀 (확인 대기 중)
          if (canSelectForDraw && selectedForDraw === name) {
            return (
              <SelectedForDrawCell
                key={index}
                onClick={() => setSelectedForDraw(null)}
              >
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
              </SelectedForDrawCell>
            );
          }

          // 선택 가능한 셀
          if (canSelectForDraw) {
            return (
              <SelectableCell
                key={index}
                onClick={() => setSelectedForDraw(name)}
              >
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
              </SelectableCell>
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

      {/* 뽑기 확인 섹션 */}
      {isMyTurn && selectedForDraw && (
        <DrawConfirmSection>
          <DrawConfirmText>
            <strong>{selectedForDraw}</strong>을(를) 뽑으시겠습니까?
          </DrawConfirmText>
          <DrawConfirmButtons>
            <ConfirmButton
              onClick={() => {
                if (onSelectForDraw && !isDrawing) {
                  onSelectForDraw(selectedForDraw);
                  setSelectedForDraw(null);
                }
              }}
              disabled={isDrawing}
            >
              {isDrawing ? '뽑는 중...' : '확인'}
            </ConfirmButton>
            <CancelButton onClick={() => setSelectedForDraw(null)}>
              취소
            </CancelButton>
          </DrawConfirmButtons>
        </DrawConfirmSection>
      )}

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
