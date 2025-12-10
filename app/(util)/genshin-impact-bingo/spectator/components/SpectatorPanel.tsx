'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { DrawnNamesTitle } from '../../components/BingoGame/BingoGame.styles';
import { usePresenceOnlineUsers } from '../../components/BingoGame/hooks';
import { getProfileImagePath } from '../../lib/auth';
import {
  getAllPlayers,
  getGameState,
  subscribeToGameState,
  subscribeToPlayers,
  type GameState,
  type Player,
} from '../../lib/game';
import {
  Container,
  DrawnNameDisplay,
  DrawnNamesList,
  DrawnNamesSection,
  DrawnNameTag,
  EmptyState,
  EmptyText,
  GameStatusBar,
  MainContent,
  OnlineIndicator,
  PlayerAvatar,
  PlayerCard,
  PlayerInfo,
  PlayerList,
  PlayerListSection,
  PlayerName,
  PlayerScore,
  PlayerStatus,
  SectionTitle,
  StatusItem,
  StatusLabel,
  StatusValue,
  Title,
  TurnIndicator,
} from './SpectatorPanel.styles';

export function SpectatorPanel() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { onlineUserIds } = usePresenceOnlineUsers();

  useEffect(() => {
    const init = async () => {
      const [state, playerList] = await Promise.all([
        getGameState(),
        getAllPlayers(),
      ]);
      setGameState(state);
      setPlayers(playerList);
      setIsLoading(false);
    };
    void init();

    const gameSubscription = subscribeToGameState((state) => {
      setGameState(state);
    });

    const playersSubscription = subscribeToPlayers((playerList) => {
      setPlayers(playerList);
      // 선택된 플레이어 정보 업데이트
      if (selectedPlayer) {
        const updated = playerList.find((p) => p.id === selectedPlayer.id);
        if (updated) setSelectedPlayer(updated);
      }
    });

    return () => {
      void gameSubscription.unsubscribe();
      void playersSubscription.unsubscribe();
    };
  }, [selectedPlayer]);

  // 온라인 플레이어만 필터링 (presence 기반)
  const onlinePlayers = players.filter((p) => onlineUserIds.includes(p.id));

  const currentTurnPlayer = players.find(
    (p) => p.order === gameState?.current_order,
  );

  if (isLoading) {
    return (
      <Container>
        <Title>로딩 중...</Title>
      </Container>
    );
  }

  return (
    <Container>
      <Title>관전 페이지</Title>

      {/* 게임 상태 바 */}
      <GameStatusBar>
        <StatusItem>
          <StatusLabel>상태:</StatusLabel>
          <StatusValue
            status={
              gameState?.is_finished
                ? 'finished'
                : gameState?.is_started
                  ? 'started'
                  : 'waiting'
            }
          >
            {gameState?.is_finished
              ? '종료됨'
              : gameState?.is_started
                ? '진행 중'
                : '대기 중'}
          </StatusValue>
        </StatusItem>

        <StatusItem>
          <StatusLabel>온라인:</StatusLabel>
          <StatusValue>{onlinePlayers.length}명</StatusValue>
        </StatusItem>

        {gameState?.is_started && currentTurnPlayer && (
          <StatusItem>
            <StatusLabel>현재 턴:</StatusLabel>
            <StatusValue>{currentTurnPlayer.name}</StatusValue>
          </StatusItem>
        )}

        {gameState?.drawn_names && gameState.drawn_names.length > 0 && (
          <DrawnNameDisplay>
            마지막: {gameState.drawn_names.at(-1)}
          </DrawnNameDisplay>
        )}
      </GameStatusBar>

      <MainContent>
        {/* 플레이어 목록 */}
        <PlayerListSection>
          <SectionTitle>
            🟢 온라인 플레이어 ({onlinePlayers.length})
          </SectionTitle>
          <PlayerList>
            {onlinePlayers.length === 0 ? (
              <EmptyState>
                <EmptyText>온라인 플레이어가 없습니다</EmptyText>
              </EmptyState>
            ) : (
              onlinePlayers.map((player) => (
                <PlayerCard
                  key={player.id}
                  isSelected={selectedPlayer?.id === player.id}
                  isOnline={onlineUserIds.includes(player.id)}
                  onClick={() => setSelectedPlayer(player)}
                >
                  <PlayerAvatar>
                    <Image
                      src={getProfileImagePath(
                        player.profile_image || 'Nahida',
                      )}
                      alt={player.name}
                      width={40}
                      height={40}
                      style={{ borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <OnlineIndicator
                      isOnline={onlineUserIds.includes(player.id)}
                    />
                  </PlayerAvatar>
                  <PlayerInfo>
                    <PlayerName>
                      {player.name}
                      {currentTurnPlayer?.id === player.id && (
                        <TurnIndicator style={{ marginLeft: '8px' }}>
                          턴
                        </TurnIndicator>
                      )}
                    </PlayerName>
                    <PlayerStatus>
                      {player.board.filter(
                        (item) => item !== null && item !== '',
                      ).length === 25
                        ? player.is_ready
                          ? '준비 완료'
                          : '보드 완성'
                        : `보드 ${
                            player.board.filter(
                              (item) => item !== null && item !== '',
                            ).length
                          }/25`}
                    </PlayerStatus>
                  </PlayerInfo>
                  <PlayerScore>{player.score}줄</PlayerScore>
                </PlayerCard>
              ))
            )}
          </PlayerList>
        </PlayerListSection>
      </MainContent>

      {/* 뽑은 이름 목록 */}
      {gameState?.is_started && gameState.drawn_names.length > 0 && (
        <DrawnNamesSection>
          <DrawnNamesTitle>
            뽑은 이름 ({gameState.drawn_names.length}개)
          </DrawnNamesTitle>
          <DrawnNamesList>
            {gameState.drawn_names.map((name, index) => (
              <DrawnNameTag
                key={`${name}-${index}`}
                isLatest={index === gameState.drawn_names.length - 1}
              >
                {name}
              </DrawnNameTag>
            ))}
          </DrawnNamesList>
        </DrawnNamesSection>
      )}
    </Container>
  );
}
