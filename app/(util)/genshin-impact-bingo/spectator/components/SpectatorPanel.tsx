'use client';

import { useEffect, useState } from 'react';
import { DrawnNamesTitle } from '../../components/BingoGame/BingoGame.styles';
import { useOnlineSnapshotUserIds } from '../../components/BingoGame/hooks';
import { Ranking } from '../../components/Ranking';
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
  GameStatusBar,
  MainContent,
  StatusItem,
  StatusLabel,
  StatusValue,
  Title,
} from './SpectatorPanel.styles';

export function SpectatorPanel() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { onlineUserIds } = useOnlineSnapshotUserIds();

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

  // 온라인 플레이어만 필터링 (last_seen 스냅샷 기반)
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
      <GameStatusBar style={{ flexDirection: 'column' }}>
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
        <Ranking isGameStarted={gameState?.is_started} isSpectator={true} />
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
