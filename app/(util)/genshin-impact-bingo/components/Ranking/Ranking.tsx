'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { getProfileImagePath } from '../../lib/auth';
import {
  getOnlinePlayersRanking,
  subscribeToOnlinePlayersRanking,
  type Player,
} from '../../lib/game';
import {
  Container,
  ExpandButton,
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

// 공동 순위 계산 (25칸 완성자 우선)
function calculateRanks(players: Player[]): Map<number, number> {
  const rankMap = new Map<number, number>();
  let currentRank = 1;
  let prevScore = -1;
  let prevComplete = false;

  for (const [index, player] of players.entries()) {
    const isComplete = player.board.length === 25 && player.score === 12;

    // 점수가 다르거나 완성 상태가 다르면 순위 변경
    if (player.score !== prevScore || isComplete !== prevComplete) {
      currentRank = index + 1;
    }
    rankMap.set(player.id, currentRank);
    prevScore = player.score;
    prevComplete = isComplete;
  }

  return rankMap;
}

interface RankingProps {
  isGameStarted?: boolean;
  userId?: number;
}

export function Ranking({ isGameStarted, userId }: RankingProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

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

  // 표시할 플레이어 목록 계산 (3위까지 + 자기자신)
  const displayPlayers = useMemo(() => {
    if (isExpanded) return players;

    const top3: Player[] = [];
    const seenRanks = new Set<number>();

    // 3위까지 추가 (공동 순위 포함)
    for (const player of players) {
      const rank = rankMap.get(player.id) ?? 0;
      if (rank <= 3) {
        top3.push(player);
        seenRanks.add(player.id);
      }
    }

    // 자기자신이 3위 밖이면 추가
    if (userId) {
      const myPlayer = players.find((p) => p.id === userId);
      if (myPlayer && !seenRanks.has(userId)) {
        top3.push(myPlayer);
      }
    }

    return top3;
  }, [players, rankMap, userId, isExpanded]);

  const hasMorePlayers = players.length > displayPlayers.length;

  return (
    <Container>
      <Title>실시간 순위</Title>
      <RankList>
        {displayPlayers.map((player) => {
          const rank = rankMap.get(player.id) ?? 0;
          const isMe = player.id === userId;
          return (
            <RankItem key={player.id} rank={getRankVariant(rank)} isMe={isMe}>
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
                  <PlayerName>
                    {player.name}
                    {isMe && ' (나)'}
                  </PlayerName>
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
      {(hasMorePlayers || isExpanded) && players.length > 0 && (
        <ExpandButton onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded
            ? '접기'
            : `더보기 (${players.length - displayPlayers.length}명)`}
        </ExpandButton>
      )}
    </Container>
  );
}
