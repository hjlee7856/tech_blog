'use client';

import Image from 'next/image';
import { getProfileImagePath } from '../../../lib/auth';
import type { Player } from '../../../lib/game';
import {
  CountdownText,
  ModalContent,
  ModalOverlay,
  ModalTitle,
  MyRankDisplay,
  RankingItem,
  RankingList,
  WinnerName,
} from '../BingoGame.styles';

interface FinishModalProps {
  isOpen: boolean;
  finalRanking: Player[];
  userId: number;
  countdown: number | null;
  countdownType: 'start' | 'reset' | null;
}

function getRank(index: number, players: Player[]): number {
  if (index === 0) return 1;
  const prevPlayer = players[index - 1];
  const currentPlayer = players[index];
  if (prevPlayer && currentPlayer && prevPlayer.score === currentPlayer.score) {
    return getRank(index - 1, players);
  }
  return index + 1;
}

export function FinishModal({
  isOpen,
  finalRanking,
  userId,
  countdown,
  countdownType,
}: FinishModalProps) {
  if (!isOpen) return null;

  const topPlayers = finalRanking.filter((_, index) => {
    const rank = getRank(index, finalRanking);
    return rank <= 3;
  });
  const isWinner = finalRanking[0]?.id === userId;
  const myIndex = finalRanking.findIndex((p) => p.id === userId);
  const myRank = myIndex !== -1 ? getRank(myIndex, finalRanking) : null;
  const isInTop3 = myRank !== null && myRank <= 3;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>게임 종료!</ModalTitle>
        {isWinner && <WinnerName>축하합니다! 순위를 확인하세요!</WinnerName>}
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

        {myRank !== null && !isInTop3 && (
          <MyRankDisplay>
            내 순위: {myRank}위 ({finalRanking[myIndex]?.score ?? 0}줄)
          </MyRankDisplay>
        )}

        {countdown !== null && countdownType === 'reset' && (
          <CountdownText style={{ marginTop: '16px', color: '#FAA61A' }}>
            {countdown}초 후 처음으로 돌아갑니다...
          </CountdownText>
        )}
      </ModalContent>
    </ModalOverlay>
  );
}
