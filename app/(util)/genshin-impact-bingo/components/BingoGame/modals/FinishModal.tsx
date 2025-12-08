'use client';

import Image from 'next/image';
import { useState } from 'react';
import { getProfileImagePath } from '../../../lib/auth';
import { resetGame, startGame, type Player } from '../../../lib/game';
import {
  ConfirmDialog,
  ConfirmDialogButtons,
  ConfirmDialogText,
  ConfirmDialogTitle,
  CountdownText,
  ModalContent,
  ModalOverlay,
  ModalTitle,
  MyRankDisplay,
  RankingItem,
  RankingList,
  RestartButton,
  WinnerName,
} from '../BingoGame.styles';

interface FinishModalProps {
  isOpen: boolean;
  finalRanking: Player[];
  userId: number;
  isAdmin: boolean;
  onReset: () => void;
}

// 25칸 완성자 우선, 그 다음 score 기준 순위 계산
function getRank(index: number, players: Player[]): number {
  if (index === 0) return 1;
  const prevPlayer = players[index - 1];
  const currentPlayer = players[index];
  if (!prevPlayer || !currentPlayer) return index + 1;

  const prevComplete =
    prevPlayer.board.length === 25 && prevPlayer.score === 12;
  const currentComplete =
    currentPlayer.board.length === 25 && currentPlayer.score === 12;

  // 완성 상태와 점수가 같으면 동일 순위
  if (
    prevComplete === currentComplete &&
    prevPlayer.score === currentPlayer.score
  ) {
    return getRank(index - 1, players);
  }
  return index + 1;
}

type ConfirmAction = 'restart' | null;

export function FinishModal({
  isOpen,
  finalRanking,
  userId,
  isAdmin,
  onReset,
}: FinishModalProps) {
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const topPlayers = finalRanking.filter((_, index) => {
    const rank = getRank(index, finalRanking);
    return rank <= 3;
  });
  const isWinner = finalRanking[0]?.id === userId;
  const myIndex = finalRanking.findIndex((p) => p.id === userId);
  const myRank = myIndex !== -1 ? getRank(myIndex, finalRanking) : null;

  const handleRestart = async () => {
    setIsProcessing(true);
    await resetGame();
    await startGame(true); // 강제 시작
    setConfirmAction(null);
    setIsProcessing(false);
    onReset();
  };

  // 확인 다이얼로그 (재시작 전용)
  if (confirmAction === 'restart') {
    return (
      <ModalOverlay>
        <ConfirmDialog>
          <ConfirmDialogTitle>게임 재시작</ConfirmDialogTitle>
          <ConfirmDialogText>
            현재 보드를 유지하고 게임을 다시 시작합니다. 계속하시겠습니까?
          </ConfirmDialogText>
          <ConfirmDialogButtons>
            <RestartButton
              onClick={() => void handleRestart()}
              disabled={isProcessing}
            >
              {isProcessing ? '처리 중...' : '확인'}
            </RestartButton>
            <RestartButton
              onClick={() => setConfirmAction(null)}
              disabled={isProcessing}
              style={{ backgroundColor: '#3F4147' }}
            >
              취소
            </RestartButton>
          </ConfirmDialogButtons>
        </ConfirmDialog>
      </ModalOverlay>
    );
  }

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>게임 종료!</ModalTitle>
        {isWinner && <WinnerName>님 축하합니다! 우승하셨습니다!</WinnerName>}
        <RankingList>
          {topPlayers.map((player) => {
            const playerIndex = finalRanking.findIndex(
              (p) => p.id === player.id,
            );
            const rank = getRank(playerIndex, finalRanking);
            return (
              <RankingItem
                key={player.id}
                rank={rank <= 3 ? (rank as 1 | 2 | 3) : undefined}
              >
                <span
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
                  <Image
                    src={getProfileImagePath(player.profile_image || 'Nahida')}
                    alt={player.name}
                    width={24}
                    height={24}
                    style={{ borderRadius: '50%' }}
                  />
                  {player.name}
                </span>
                <span>{player.score}줄</span>
              </RankingItem>
            );
          })}
        </RankingList>

        {myRank !== null && (
          <MyRankDisplay>
            내 순위: {myRank}위 ({finalRanking[myIndex]?.score ?? 0}줄)
          </MyRankDisplay>
        )}

        {isAdmin && (
          <RestartButton onClick={() => setConfirmAction('restart')}>
            게임 재시작
          </RestartButton>
        )}

        {!isAdmin && (
          <CountdownText style={{ marginTop: '16px', color: '#888' }}>
            관리자가 게임을 초기화할 때까지 대기 중...
          </CountdownText>
        )}
      </ModalContent>
    </ModalOverlay>
  );
}
