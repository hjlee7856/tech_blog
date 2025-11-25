'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getProfileImagePath } from '../../lib/auth';
import {
  getOnlinePlayersRanking,
  subscribeToOnlinePlayersRanking,
  type Player,
} from '../../lib/game';
import {
  Container,
  PlayerInfo,
  PlayerName,
  PlayerNameWrapper,
  ProfileImage,
  RankItem,
  RankList,
  RankNumber,
  ReadyBadge,
  Score,
  Title,
} from './Ranking.styles';

function getRankVariant(rank: number): 1 | 2 | 3 | undefined {
  if (rank === 1) return 1;
  if (rank === 2) return 2;
  if (rank === 3) return 3;
  return undefined;
}

// 공동 순위 계산
function calculateRanks(players: Player[]): Map<number, number> {
  const rankMap = new Map<number, number>();
  let currentRank = 1;
  let prevScore = -1;

  for (const [index, player] of players.entries()) {
    if (player.score !== prevScore) {
      currentRank = index + 1;
    }
    rankMap.set(player.id, currentRank);
    prevScore = player.score;
  }

  return rankMap;
}

interface RankingProps {
  isGameStarted?: boolean;
}

export function Ranking({ isGameStarted }: RankingProps) {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const init = async () => {
      const ranking = await getOnlinePlayersRanking();
      setPlayers(ranking);
    };
    void init();

    const subscription = subscribeToOnlinePlayersRanking((ranking) => {
      setPlayers(ranking);
    });

    return () => {
      void subscription.unsubscribe();
    };
  }, []);

  const rankMap = calculateRanks(players);

  return (
    <Container>
      <Title>🏆 실시간 순위</Title>
      <RankList>
        {players.slice(0, 10).map((player) => {
          const rank = rankMap.get(player.id) ?? 0;
          return (
            <RankItem key={player.id} rank={getRankVariant(rank)}>
              <RankNumber>{rank}</RankNumber>
              <PlayerInfo>
                <ProfileImage>
                  <Image
                    src={getProfileImagePath(player.profile_image || 'Nahida')}
                    alt={player.name}
                    width={24}
                    height={24}
                    style={{ borderRadius: '50%', objectFit: 'cover' }}
                  />
                </ProfileImage>
                <PlayerNameWrapper>
                  <PlayerName>{player.name}</PlayerName>
                  {!isGameStarted && (
                    <ReadyBadge isReady={player.is_ready}>
                      {player.is_ready ? '준비완료' : '이름 채우는 중...'}
                    </ReadyBadge>
                  )}
                </PlayerNameWrapper>
              </PlayerInfo>
              <Score>{player.score}줄</Score>
            </RankItem>
          );
        })}
        {players.length === 0 && (
          <RankItem>
            <PlayerName style={{ textAlign: 'center', color: '#B5BAC1' }}>
              온라인 참가자가 없습니다
            </PlayerName>
          </RankItem>
        )}
      </RankList>
    </Container>
  );
}
