'use client';

import Image from 'next/image';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createNameMap } from '../../lib/characterUtils';
import {
  BINGO_LINES,
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
  DrawConfirmModal,
  DrawConfirmOverlay,
  DrawConfirmText,
  MatchedCell,
  SelectableCell,
  SelectedForDrawCell,
} from './BingoBoard.styles';

export interface BingoBoardActions {
  fillRandom: () => void;
  clearAll: () => void;
}

interface BingoBoardCellProps {
  index: number;
  name: string | null;
  canEditBoard: boolean;
  isDrawing: boolean;
  selectedForDraw: string | null;
  isMatched: boolean;
  isInBingoLine: boolean;
  isAllMatched: boolean;
  canSelectForDraw: boolean;
  getImagePath: (koreanName: string) => string;
  onEditCell: (index: number) => void;
  onSelectForDrawCell: (name: string) => void;
  onUnselectDraw: () => void;
}

const BingoBoardCell = memo(function BingoBoardCell({
  index,
  name,
  canEditBoard,
  isDrawing,
  selectedForDraw,
  isMatched,
  isInBingoLine,
  isAllMatched,
  canSelectForDraw,
  getImagePath,
  onEditCell,
  onSelectForDrawCell,
  onUnselectDraw,
}: BingoBoardCellProps) {
  if (canEditBoard) {
    return (
      <Cell
        key={index}
        onClick={() => onEditCell(index)}
        style={{ cursor: 'pointer' }}
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
  }

  if (selectedForDraw === name && name) {
    return (
      <SelectedForDrawCell
        key={index}
        onClick={
          isDrawing
            ? undefined
            : () => {
                onUnselectDraw();
              }
        }
      >
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
      </SelectedForDrawCell>
    );
  }

  if (isAllMatched && isMatched && name) {
    return (
      <AllMatchedCell key={index}>
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
      </AllMatchedCell>
    );
  }

  if (isMatched && isInBingoLine && name) {
    return (
      <BingoLineCell key={index}>
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
      </BingoLineCell>
    );
  }

  if (isMatched && name) {
    return (
      <MatchedCell key={index}>
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
      </MatchedCell>
    );
  }

  if (canSelectForDraw && name) {
    return (
      <SelectableCell key={index} onClick={() => onSelectForDrawCell(name)}>
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
      </SelectableCell>
    );
  }

  return (
    <Cell key={index}>
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
});

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
  onBoardChange?: (board: (string | null)[]) => void; // 보드 상태 변경 콜백
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
  onBoardChange,
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
  const lastSavedBoardRef = useRef<string>('');

  // 이전 userId를 추적하여 변경 시 재로드
  const prevUserIdRef = useRef<number | null>(null);

  const applyBoardUpdate = useCallback(
    (updater: (prev: (string | null)[]) => (string | null)[]) => {
      isApplyingLocalChangeRef.current = true;
      setBoard((prev) => {
        const newBoard = updater([...prev]);
        // 로컬 변경 플래그는 다음 틱에 리셋
        setTimeout(() => {
          isApplyingLocalChangeRef.current = false;
        }, 0);
        return newBoard;
      });
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

      // 실제 캐릭터가 있는지 확인 (빈 문자열 제외)
      const validNames = savedBoard.filter(
        (name) => name !== '' && name !== null,
      );

      if (savedBoard.length === 25 && validNames.length > 0) {
        // 빈 문자열을 null로 변환
        setBoard(savedBoard.map((name) => (name === '' ? null : name)));
      } else if (savedBoard.length > 0 && validNames.length > 0) {
        // 부분적으로 저장된 보드가 있으면 복원
        const newBoard: (string | null)[] = Array.from<string | null>({
          length: 25,
        }).fill(null);
        for (const [idx, name] of savedBoard.entries()) {
          if (idx < 25) newBoard[idx] = name === '' ? null : name;
        }
        setBoard(newBoard);
      } else {
        // DB에 보드가 없거나 모두 빈 문자열이면 로컬도 초기화
        setBoard(Array.from<string | null>({ length: 25 }).fill(null));
      }

      // 로드 완료 후 동기화 플래그 설정
      setTimeout(() => {
        isSyncingFromServerRef.current = false;
        setIsLoaded(true);
      }, 100);
    };
    void loadBoard();

    return () => {
      isCancelled = true;
    };
  }, [userId, isLoaded]);

  // 플레이어 보드 변경 구독 (게임 초기화 시 보드 리셋 감지)
  useEffect(() => {
    const subscription = subscribeToPlayerBoard(userId, (newBoard) => {
      // 로컬 변경 중이면 무시
      if (isApplyingLocalChangeRef.current) {
        return;
      }

      // 서버에서 온 보드를 문자열로 변환하여 비교
      const newBoardStr = JSON.stringify(newBoard);
      if (newBoardStr === lastSavedBoardRef.current) {
        // 같은 보드면 무시 (자신이 저장한 것)
        return;
      }

      // 서버 동기화 플래그 설정
      isSyncingFromServerRef.current = true;

      // 실제 캐릭터가 있는지 확인 (빈 문자열 제외)
      const validNames = newBoard.filter(
        (name) => name !== '' && name !== null,
      );

      if (newBoard.length === 0 || validNames.length === 0) {
        // 보드가 초기화되었거나 모두 빈 문자열이면 로컬도 초기화
        setBoard(Array.from<string | null>({ length: 25 }).fill(null));
        setIsLoaded(false);
        isSyncingFromServerRef.current = false;
        return;
      }

      if (newBoard.length === 25) {
        // 빈 문자열을 null로 변환
        const convertedBoard = newBoard.map((name) =>
          name === '' ? null : name,
        );
        setBoard(convertedBoard);
        isSyncingFromServerRef.current = false;
        return;
      }

      const partialBoard: (string | null)[] = Array.from<string | null>({
        length: 25,
      }).fill(null);
      for (const [idx, name] of newBoard.entries()) {
        if (idx < 25) partialBoard[idx] = name === '' ? null : name;
      }
      setBoard(partialBoard);
      isSyncingFromServerRef.current = false;
    });

    return () => {
      void subscription.unsubscribe();
    };
  }, [userId]);

  // 보드 변경시 저장 및 준비 상태 체크 (로드 완료 후에만, debounce 적용)
  useEffect(() => {
    if (!isLoaded) return;

    // 서버 동기화 중이면 저장 스킵
    if (isSyncingFromServerRef.current) {
      isSyncingFromServerRef.current = false;
      return;
    }

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    const timeoutId = setTimeout(() => {
      void (async () => {
        // 보드가 완전히 비어있으면 빈 배열로 저장
        const validCount = board.filter(
          (name) => name !== null && name !== '',
        ).length;

        let boardToSave: string[];
        if (validCount === 0) {
          boardToSave = [];
        } else {
          // null을 빈 문자열로 변환하여 인덱스 유지
          boardToSave = board.map((name) => name ?? '');
        }

        // 저장 전에 현재 보드를 기록
        lastSavedBoardRef.current = JSON.stringify(boardToSave);
        await saveBoard(userId, boardToSave);

        if (validCount < 25) {
          await setReadyFalse(userId);
        }

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

  const drawnNameSet = useMemo(() => new Set(drawnNames), [drawnNames]);

  const usedNames = new Set(
    board.filter((name): name is string => name !== null),
  );
  const availableNames = characterNames.filter((name) => !usedNames.has(name));

  // 게임 참여 전(order === 0) 또는 보드 미완성 시 게임 중에도 보드 수정 가능
  const canEditBoard =
    !isGameStarted ||
    playerOrder === 0 ||
    board.filter((name) => name !== null).length < 25;

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

  const handleClearAll = useCallback(async () => {
    if (!canEditBoard) return;
    // 보드 초기화 시 빈 배열로 저장
    lastSavedBoardRef.current = JSON.stringify([]);
    await saveBoard(userId, []);
    // 준비 상태 해제
    await setReadyFalse(userId);
    // 서버 동기화 플래그 설정하여 자동 저장 방지
    isSyncingFromServerRef.current = true;
    setBoard(Array.from<string | null>({ length: 25 }).fill(null));
  }, [canEditBoard, userId]);

  // 액션 등록 (부모 컴포넌트에서 사용)
  useEffect(() => {
    if (!onRegisterActions) return;
    onRegisterActions({
      fillRandom: handleRandomFill,
      clearAll: handleClearAll,
    });
    return () => onRegisterActions(null);
  }, [handleRandomFill, handleClearAll, onRegisterActions]);

  // 보드 상태 변경 시 부모에게 알림
  useEffect(() => {
    if (onBoardChange) {
      onBoardChange(board);
    }
  }, [board, onBoardChange]);

  // 완성된 빙고 라인에 포함된 셀 인덱스 계산
  const bingoLineCells = useMemo(() => {
    // 게임에 아직 참여하지 않은 상태(order === 0)에서는 빙고 라인 표시 안 함
    if (playerOrder === 0) return new Set<number>();

    const cells = new Set<number>();
    for (const line of BINGO_LINES) {
      const isLineComplete = line.every((idx) => {
        const name = board[idx];
        return name !== null && name !== undefined && drawnNameSet.has(name);
      });
      if (isLineComplete) {
        for (const idx of line) cells.add(idx);
      }
    }
    return cells;
  }, [board, drawnNameSet, playerOrder]);

  const isMatched = useCallback(
    (name: string | null) => {
      // 게임에 아직 참여하지 않은 상태(order === 0)에서는 매칭 하이라이트를 표시하지 않음
      if (playerOrder === 0) return false;
      return name !== null && drawnNameSet.has(name);
    },
    [drawnNameSet, playerOrder],
  );

  const isInBingoLine = (index: number) => bingoLineCells.has(index);

  // 모든 셀이 매칭되었는지 확인
  const isAllMatched = useMemo(() => {
    // 게임에 아직 참여하지 않은 상태(order === 0)에서는 올 매칭 효과를 표시하지 않음
    if (playerOrder === 0) return false;

    const filledCells = board.filter((n) => n !== null);
    if (filledCells.length !== 25) return false;
    return filledCells.every((name) => drawnNameSet.has(name as string));
  }, [board, drawnNameSet, playerOrder]);

  const handleEditCell = useCallback(
    (index: number) => {
      if (!canEditBoard) return;
      setSelectedCell(index);
      setIsModalOpen(true);
    },
    [canEditBoard],
  );

  const handleSelectForDrawCell = useCallback((name: string) => {
    setSelectedForDraw(name);
  }, []);

  const handleUnselectDraw = useCallback(() => {
    setSelectedForDraw(null);
  }, []);

  const handleConfirmDraw = useCallback(
    (name: string) => {
      if (!onSelectForDraw || isDrawing) return;
      onSelectForDraw(name);
      setSelectedForDraw(null);
    },
    [isDrawing, onSelectForDraw],
  );

  return (
    <Container>
      <Board>
        {board.map((name, index) => {
          const matched = isMatched(name);
          const inBingoLine = isInBingoLine(index);
          const canSelectForDraw =
            isMyTurn && !isDrawing && !!name && !drawnNameSet.has(name);

          return (
            <BingoBoardCell
              key={index}
              index={index}
              name={name}
              canEditBoard={canEditBoard}
              isDrawing={isDrawing}
              selectedForDraw={selectedForDraw}
              isMatched={matched}
              isInBingoLine={inBingoLine}
              isAllMatched={isAllMatched}
              canSelectForDraw={canSelectForDraw}
              getImagePath={getImagePath}
              onEditCell={handleEditCell}
              onSelectForDrawCell={handleSelectForDrawCell}
              onUnselectDraw={handleUnselectDraw}
            />
          );
        })}
      </Board>

      {/* 뽑기 확인 모달 */}
      {isMyTurn && selectedForDraw && (
        <DrawConfirmOverlay onClick={() => setSelectedForDraw(null)}>
          <DrawConfirmModal
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <DrawConfirmText>
              <strong>{selectedForDraw}</strong>을(를) 뽑으시겠습니까?
            </DrawConfirmText>
            <DrawConfirmButtons>
              <ConfirmButton
                onClick={() => {
                  handleConfirmDraw(selectedForDraw);
                }}
                disabled={isDrawing}
              >
                {isDrawing ? '뽑는 중...' : '확인'}
              </ConfirmButton>
              <CancelButton onClick={() => setSelectedForDraw(null)}>
                취소
              </CancelButton>
            </DrawConfirmButtons>
          </DrawConfirmModal>
        </DrawConfirmOverlay>
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
