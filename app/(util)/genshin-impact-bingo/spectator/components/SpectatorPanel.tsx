'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { getProfileImagePath } from '../../lib/auth';
import { createNameMap } from '../../lib/characterUtils';
import {
  getAllPlayers,
  getGameState,
  subscribeToGameState,
  subscribeToPlayers,
  type GameState,
  type Player,
} from '../../lib/game';
import {
  BingoLineSpectatorCell,
  BoardContainer,
  BoardSection,
  CellImage,
  CellName,
  Container,
  DrawnNameDisplay,
  DrawnNamesList,
  DrawnNamesSection,
  DrawnNameTag,
  EmptyState,
  EmptyText,
  GameStatusBar,
  MainContent,
  MatchedSpectatorCell,
  OnlineIndicator,
  PlayerAvatar,
  PlayerCard,
  PlayerInfo,
  PlayerList,
  PlayerListSection,
  PlayerName,
  PlayerScore,
  PlayerStatus,
  ReadyBadge,
  ScoreBadge,
  SectionTitle,
  SelectedPlayerHeader,
  SelectedPlayerInfo,
  SelectedPlayerName,
  SpectatorBoard,
  SpectatorCell,
  StatusItem,
  StatusLabel,
  StatusValue,
  Title,
  TurnIndicator,
} from './SpectatorPanel.styles';
import { DrawnNamesTitle } from '../../components/BingoGame/BingoGame.styles';

// 빙고 라인 정의
const BINGO_LINES = [
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20],
];

function getBingoLineCells(board: string[], drawnNames: string[]) {
  const cells = new Set<number>();
  for (const line of BINGO_LINES) {
    const isLineComplete = line.every((idx) => {
      const name = board[idx];
      return name !== null && name !== undefined && drawnNames.includes(name);
    });
    if (isLineComplete) {
      for (const idx of line) cells.add(idx);
    }
  }
  return cells;
}

function isMatched(name: string | undefined, drawnNames: string[]) {
  return name !== undefined && drawnNames.includes(name);
}

interface SpectatorPanelProps {
  characterNames: string[];
  characterEnNames: string[];
}

export function SpectatorPanel({
  characterNames,
  characterEnNames,
}: SpectatorPanelProps) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const nameMap = useMemo(
    () => createNameMap(characterNames, characterEnNames),
    [characterNames, characterEnNames],
  );

  const getImagePath = (koreanName: string) => {
    const englishName = nameMap.get(koreanName);
    if (!englishName) return '/genshin-impact/Aino_Avatar.webp';
    const safeName = englishName.replaceAll(' ', '_').replaceAll('%20', '_');
    return `/genshin-impact/${safeName}_Avatar.webp`;
  };

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

  // 온라인 플레이어만 필터링
  const onlinePlayers = players.filter((p) => p.is_online);

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
                  isOnline={player.is_online}
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
                    <OnlineIndicator isOnline={player.is_online} />
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
                      {player.board.length === 25
                        ? player.is_ready
                          ? '준비 완료'
                          : '보드 완성'
                        : `보드 ${player.board.length}/25`}
                    </PlayerStatus>
                  </PlayerInfo>
                  <PlayerScore>{player.score}줄</PlayerScore>
                </PlayerCard>
              ))
            )}
          </PlayerList>
        </PlayerListSection>

        {/* 선택된 플레이어 보드 */}
        <BoardSection>
          {selectedPlayer ? (
            <BoardContainer>
              <SelectedPlayerHeader>
                <SelectedPlayerInfo>
                  <Image
                    src={getProfileImagePath(
                      selectedPlayer.profile_image || 'Nahida',
                    )}
                    alt={selectedPlayer.name}
                    width={48}
                    height={48}
                    style={{ borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <SelectedPlayerName>
                      {selectedPlayer.name}
                    </SelectedPlayerName>
                    <ReadyBadge isReady={selectedPlayer.is_ready}>
                      {selectedPlayer.is_ready ? '준비 완료' : '대기 중'}
                    </ReadyBadge>
                  </div>
                </SelectedPlayerInfo>
                <ScoreBadge>{selectedPlayer.score}줄 완성</ScoreBadge>
              </SelectedPlayerHeader>

              {selectedPlayer.board.length === 0 ? (
                <EmptyState>
                  <EmptyText>아직 보드를 작성하지 않았습니다</EmptyText>
                </EmptyState>
              ) : (
                <SpectatorBoard>
                  {Array.from({ length: 25 }).map((_, index) => {
                    const name = selectedPlayer.board[index];
                    const drawnNames = gameState?.drawn_names || [];
                    const matched = isMatched(name, drawnNames);
                    const bingoLineCells = getBingoLineCells(
                      selectedPlayer.board,
                      drawnNames,
                    );
                    const inBingoLine = bingoLineCells.has(index);

                    // 빙고 줄에 포함된 셀
                    if (matched && inBingoLine) {
                      return (
                        <BingoLineSpectatorCell key={index}>
                          {name && (
                            <>
                              <CellImage>
                                <Image
                                  src={getImagePath(name)}
                                  alt={name}
                                  width={36}
                                  height={36}
                                  style={{ objectFit: 'cover' }}
                                />
                              </CellImage>
                              <CellName>{name}</CellName>
                            </>
                          )}
                        </BingoLineSpectatorCell>
                      );
                    }

                    // 매칭된 셀
                    if (matched) {
                      return (
                        <MatchedSpectatorCell key={index}>
                          {name && (
                            <>
                              <CellImage>
                                <Image
                                  src={getImagePath(name)}
                                  alt={name}
                                  width={36}
                                  height={36}
                                  style={{ objectFit: 'cover' }}
                                />
                              </CellImage>
                              <CellName>{name}</CellName>
                            </>
                          )}
                        </MatchedSpectatorCell>
                      );
                    }

                    // 일반 셀
                    return (
                      <SpectatorCell key={index}>
                        {name ? (
                          <>
                            <CellImage>
                              <Image
                                src={getImagePath(name)}
                                alt={name}
                                width={36}
                                height={36}
                                style={{ objectFit: 'cover' }}
                              />
                            </CellImage>
                            <CellName>{name}</CellName>
                          </>
                        ) : (
                          <span style={{ color: '#747F8D' }}>빈칸</span>
                        )}
                      </SpectatorCell>
                    );
                  })}
                </SpectatorBoard>
              )}
            </BoardContainer>
          ) : (
            <BoardContainer>
              <EmptyState>
                <EmptyText>
                  플레이어를 선택하면
                  <br />
                  보드를 확인할 수 있습니다
                </EmptyText>
              </EmptyState>
            </BoardContainer>
          )}
        </BoardSection>
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
