'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { getProfileImagePath } from '../../lib/auth';
import {
  getOnlinePlayersRanking,
  subscribeToGameState,
  subscribeToOnlinePlayersRanking,
  type Player,
} from '../../lib/game';
import { calculateRankMap } from '../../lib/ranking';
import {
  AvatarStack,
  AvatarStackItem,
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

interface RankingProps {
  isGameStarted?: boolean;
  userId?: number;
  isSpectator?: boolean;
}

export function Ranking({ isGameStarted, userId, isSpectator }: RankingProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const init = async () => {
      const ranking = await getOnlinePlayersRanking();
      setPlayers(ranking);
    };
    void init();

    const playerSubscription = subscribeToOnlinePlayersRanking((ranking) => {
      setPlayers(ranking);
    });

    // 게임 상태 변경 시에도 순위 갱신 (게임 시작/종료 시 필터링 로직 변경)
    const gameStateSubscription = subscribeToGameState(async () => {
      const ranking = await getOnlinePlayersRanking();
      setPlayers(ranking);
    });

    return () => {
      void playerSubscription.unsubscribe();
      void gameStateSubscription.unsubscribe();
    };
  }, []);

  const rankMap = calculateRankMap(players);

  // 공동 순위별로 플레이어 그룹화
  const rankedGroups = useMemo(() => {
    const groups = new Map<number, Player[]>();
    for (const player of players) {
      const rank = rankMap.get(player.id) ?? 0;
      if (!groups.has(rank)) {
        groups.set(rank, []);
      }
      groups.get(rank)?.push(player);
    }
    return groups;
  }, [players, rankMap]);

  // 표시할 순위 그룹 계산 (3위까지 + 자기자신)
  const displayGroups = useMemo(() => {
    if (isExpanded) {
      return Array.from(rankedGroups.entries()).toSorted(([a], [b]) => a - b);
    }

    const top3Groups: Array<[number, Player[]]> = [];
    const seenRanks = new Set<number>();

    // 3위까지 추가 (공동 순위 포함)
    for (const [rank, groupPlayers] of rankedGroups.entries()) {
      if (rank <= 3) {
        top3Groups.push([rank, groupPlayers]);
        seenRanks.add(rank);
      }
    }

    // 자기자신이 3위 밖이면 추가
    if (userId) {
      const myRank = rankMap.get(userId) ?? 0;
      if (myRank > 3 && !seenRanks.has(myRank)) {
        const myGroup = rankedGroups.get(myRank);
        if (myGroup) {
          top3Groups.push([myRank, myGroup]);
        }
      }
    }

    return top3Groups.toSorted(([a], [b]) => a - b);
  }, [rankedGroups, rankMap, userId, isExpanded]);

  const totalDisplayedPlayers = displayGroups.reduce(
    (sum, [, group]) => sum + group.length,
    0,
  );
  const hasMorePlayers = players.length > totalDisplayedPlayers;

  return (
    <Container isSpectator={isSpectator}>
      <Title>실시간 순위</Title>
      <RankList>
        {displayGroups.map(([rank, groupPlayers]) => {
          // 공동 순위인 경우 (2명 이상)
          if (groupPlayers.length > 1) {
            const hasMe = groupPlayers.some((p) => p.id === userId);
            const names = groupPlayers
              .map((p) => (p.id === userId ? `${p.name} (나)` : p.name))
              .join(', ');
            const score = groupPlayers[0]?.score ?? 0;

            return (
              <RankItem key={rank} rank={getRankVariant(rank)} isMe={hasMe}>
                <RankNumber>{rank}위</RankNumber>
                <PlayerInfo>
                  <AvatarStack>
                    {groupPlayers.slice(0, 5).map((player) => (
                      <AvatarStackItem key={player.id}>
                        <Image
                          src={getProfileImagePath(
                            player.profile_image || 'Nahida',
                          )}
                          alt={player.name}
                          width={24}
                          height={24}
                          style={{ borderRadius: '50%', objectFit: 'cover' }}
                        />
                      </AvatarStackItem>
                    ))}
                  </AvatarStack>
                  <PlayerNameWrapper>
                    <PlayerName>{names}</PlayerName>
                    {!isGameStarted && groupPlayers.some((p) => p.is_ready) && (
                      <ReadyBadge
                        isReady={groupPlayers.every((p) => p.is_ready)}
                      >
                        {groupPlayers.every((p) => p.is_ready)
                          ? '준비완료'
                          : '이름 채우는 중...'}
                      </ReadyBadge>
                    )}
                  </PlayerNameWrapper>
                </PlayerInfo>
                <Score>{score}줄</Score>
              </RankItem>
            );
          }

          // 단독 순위인 경우
          const player = groupPlayers[0];
          if (!player) return null;
          const isMe = player.id === userId;

          return (
            <RankItem key={player.id} rank={getRankVariant(rank)} isMe={isMe}>
              <RankNumber>{rank}위</RankNumber>
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
              게임 참가자가 없습니다
            </PlayerName>
          </RankItem>
        )}
      </RankList>
      {(hasMorePlayers || isExpanded) && players.length > 0 && (
        <ExpandButton onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded
            ? '접기'
            : `더보기 (${players.length - totalDisplayedPlayers}명)`}
        </ExpandButton>
      )}
    </Container>
  );
}
