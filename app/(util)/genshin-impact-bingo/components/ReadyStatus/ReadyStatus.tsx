'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getProfileImagePath } from '../../lib/auth';
import { getAllPlayers, subscribeToPlayers, type Player } from '../../lib/game';
import { usePresenceOnlineUsers } from '../BingoGame/hooks';
import {
  Container,
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
  const { onlineUserIds } = usePresenceOnlineUsers();

  useEffect(() => {
    const init = async () => {
      const allPlayers = await getAllPlayers();
      // 온라인 유저만 표시
      const onlinePlayers = allPlayers.filter((p) => p.is_online);
      setPlayers(onlinePlayers);
    };
    void init();

    const subscription = subscribeToPlayers((allPlayers: Player[]) => {
      // 온라인 유저만 표시
      const onlinePlayers = allPlayers.filter((p) => p.is_online);
      setPlayers(onlinePlayers);
    });

    return () => {
      void subscription.unsubscribe();
    };
  }, []);

  return (
    <Container>
      <Title>
        참가자 준비 상태
        {onlineUserIds.length > 0 && ` (온라인 ${onlineUserIds.length}명)`}
      </Title>
      <PlayerList>
        {players.map((player) => {
          const isMe = player.id === userId;
          const boardCount = player.board.filter(
            (item) => item !== null && item !== '',
          ).length;

          return (
            <PlayerItem key={player.id} isMe={isMe}>
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
                  <ReadyBadge isReady={player.is_ready}>
                    {player.is_ready ? '준비완료' : `${boardCount}/25`}
                  </ReadyBadge>
                </PlayerNameWrapper>
              </PlayerInfo>
            </PlayerItem>
          );
        })}
        {players.length === 0 && (
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
