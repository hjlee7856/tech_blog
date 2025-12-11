'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getProfileImagePath } from '../../lib/auth';
import { getAllPlayers, subscribeToPlayers, type Player } from '../../lib/game';
import { useOnlineSnapshotUserIds } from '../BingoGame/hooks';
import {
  Container,
  OnlineDot,
  PlayerInfo,
  PlayerItem,
  PlayerList,
  PlayerName,
  PlayerNameWrapper,
  ProfileImage,
  ReadyBadge,
  Title,
} from './ReadyStatus.styles';

interface ReadyStatusProps {
  userId?: number;
}

export function ReadyStatus({ userId }: ReadyStatusProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const { onlineUserIds } = useOnlineSnapshotUserIds();

  useEffect(() => {
    const init = async () => {
      const allPlayers = await getAllPlayers();
      setPlayers(allPlayers);
    };

    void init();

    const subscription = subscribeToPlayers((allPlayers: Player[]) => {
      // 실시간 변경 시에도 전체 플레이어 목록을 갱신한 뒤 presence로 온라인만 표시
      setPlayers(allPlayers);
    });

    return () => {
      void subscription.unsubscribe();
    };
  }, []);

  const visiblePlayers = players.filter((player) =>
    onlineUserIds.includes(player.id),
  );

  return (
    <Container>
      <Title>
        참가자 준비 상태
        {onlineUserIds.length > 0 && ` (온라인 ${onlineUserIds.length}명)`}
      </Title>
      <PlayerList>
        {visiblePlayers.map((player) => {
          const isMe = player.id === userId;
          const boardCount = player.board.filter(
            (item) => item !== null && item !== '',
          ).length;

          return (
            <PlayerItem key={player.id} isMe={isMe}>
              <PlayerInfo>
                <OnlineDot isOnline={onlineUserIds.includes(player.id)} />
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
                  <ReadyBadge isReady={player.is_ready}>
                    {player.is_ready ? '준비완료' : `${boardCount}/25`}
                  </ReadyBadge>
                </PlayerNameWrapper>
              </PlayerInfo>
            </PlayerItem>
          );
        })}
        {visiblePlayers.length === 0 && (
          <PlayerItem>
            <PlayerName style={{ textAlign: 'center', color: '#B5BAC1' }}>
              온라인 참가자가 없습니다
            </PlayerName>
          </PlayerItem>
        )}
      </PlayerList>
    </Container>
  );
}
