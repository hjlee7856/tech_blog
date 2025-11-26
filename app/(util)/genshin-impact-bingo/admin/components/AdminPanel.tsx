'use client';

import { useEffect, useState } from 'react';
import { autoLogin, type User } from '../../lib/auth';
import {
  checkAndUpdateAllScores,
  deletePlayer,
  drawName,
  getAllPlayers,
  getGameState,
  nextTurn,
  resetGame,
  startGame,
  subscribeToGameState,
  subscribeToPlayers,
  type GameState,
  type Player,
} from '../../lib/game';
import {
  Button,
  ButtonGroup,
  Container,
  CurrentTurnInfo,
  DeleteButton,
  DrawnName,
  DrawnNamesList,
  InfoText,
  PlayerActions,
  PlayerInfo,
  PlayerItem,
  PlayerList,
  PlayerName,
  PlayerScore,
  PlayerStatus,
  Section,
  SectionTitle,
  StatusBadge,
  Title,
  TurnLabel,
  TurnPlayer,
} from './AdminPanel.styles';

interface AdminPanelProps {
  characterNames: string[];
}

export function AdminPanel({ characterNames }: AdminPanelProps) {
  const [user, setUser] = useState<User | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [drawnName, setDrawnName] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const authResult = await autoLogin();
      if (!authResult.success || !authResult.user?.is_admin) {
        setIsLoading(false);
        return;
      }
      setUser(authResult.user);

      const [state, playerList] = await Promise.all([
        getGameState(),
        getAllPlayers(),
      ]);
      setGameState(state);
      setPlayers(playerList);
      setIsLoading(false);
    };
    void init();

    const stateSubscription = subscribeToGameState((state) => {
      setGameState(state);
    });

    const playersSubscription = subscribeToPlayers((playerList) => {
      setPlayers(playerList);
    });

    return () => {
      void stateSubscription.unsubscribe();
      void playersSubscription.unsubscribe();
    };
  }, []);

  const handleStartGame = async () => {
    const result = await startGame();
    if (result.success) {
      const state = await getGameState();
      setGameState(state);
    } else {
      alert(result.error || '게임 시작에 실패했습니다.');
    }
  };

  const handleResetGame = async () => {
    if (
      !confirm(
        '정말 게임을 초기화하시겠습니까? 모든 플레이어의 점수와 보드가 초기화됩니다.',
      )
    )
      return;
    const success = await resetGame();
    if (success) {
      const [state, playerList] = await Promise.all([
        getGameState(),
        getAllPlayers(),
      ]);
      setGameState(state);
      setPlayers(playerList);
      setDrawnName(null);
    }
  };

  const handleDrawName = async () => {
    if (!gameState) return;
    const result = await drawName(characterNames, gameState.drawn_names);
    if (result.success && result.name) {
      setDrawnName(result.name);
      // 이름 뽑은 후 모든 플레이어 점수 체크
      const newDrawnNames = [...gameState.drawn_names, result.name];
      await checkAndUpdateAllScores(newDrawnNames);
      const [state, playerList] = await Promise.all([
        getGameState(),
        getAllPlayers(),
      ]);
      setGameState(state);
      setPlayers(playerList);
    } else {
      alert(result.error);
    }
  };

  const handleNextTurn = async () => {
    const activePlayers = players.filter((p) => p.order > 0);
    if (activePlayers.length === 0) return;
    await nextTurn(activePlayers.length);
    const state = await getGameState();
    setGameState(state);
    setDrawnName(null);
  };

  const handleDeletePlayer = async (userId: number, playerName: string) => {
    if (!confirm(`정말 "${playerName}" 플레이어를 삭제하시겠습니까?`)) return;
    const success = await deletePlayer(userId);
    if (success) {
      const playerList = await getAllPlayers();
      setPlayers(playerList);
    }
  };

  const getCurrentTurnPlayer = () => {
    if (!gameState || gameState.current_order === 0) return null;
    return players.find((p) => p.order === gameState.current_order);
  };

  if (isLoading) {
    return (
      <Container>
        <Title>로딩 중...</Title>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <Title>⛔ 접근 권한이 없습니다</Title>
        <InfoText style={{ textAlign: 'center' }}>
          어드민 권한이 있는 계정으로 로그인해주세요.
        </InfoText>
      </Container>
    );
  }

  const currentPlayer = getCurrentTurnPlayer();

  return (
    <Container>
      <Title>🎮 빙고 어드민</Title>
      <Section>
        <SectionTitle>
          게임 상태:{' '}
          <StatusBadge
            status={
              gameState?.is_finished
                ? 'stopped'
                : gameState?.is_started
                  ? 'started'
                  : 'stopped'
            }
          >
            {gameState?.is_finished
              ? '종료됨'
              : gameState?.is_started
                ? '진행 중'
                : '대기 중'}
          </StatusBadge>
        </SectionTitle>
        <ButtonGroup>
          <Button
            variant="success"
            onClick={handleStartGame}
            disabled={gameState?.is_started || gameState?.is_finished}
          >
            게임 시작
          </Button>
          <Button variant="danger" onClick={handleResetGame}>
            {gameState?.is_finished ? '새 게임 시작' : '게임 초기화'}
          </Button>
        </ButtonGroup>
        {gameState?.is_finished && (
          <InfoText style={{ color: '#3BA55C', marginTop: '12px' }}>
            🏆 게임이 종료되었습니다! "새 게임 시작" 버튼을 눌러 새로운 게임을
            시작하세요.
          </InfoText>
        )}
      </Section>

      {gameState?.is_started && (
        <Section>
          <SectionTitle>현재 턴</SectionTitle>
          <CurrentTurnInfo>
            <TurnLabel>현재 차례:</TurnLabel>
            <TurnPlayer>{currentPlayer?.name || '없음'}</TurnPlayer>
          </CurrentTurnInfo>
          <ButtonGroup>
            <Button variant="primary" onClick={handleDrawName}>
              🎲 이름 뽑기
            </Button>
            <Button variant="success" onClick={handleNextTurn}>
              다음 턴 →
            </Button>
          </ButtonGroup>
          {drawnName && (
            <InfoText
              style={{ marginTop: '16px', fontSize: '18px', color: '#5865F2' }}
            >
              🎉 뽑힌 이름: <strong>{drawnName}</strong>
            </InfoText>
          )}
        </Section>
      )}

      <Section>
        <SectionTitle>
          뽑힌 이름 목록 ({gameState?.drawn_names.length || 0}개)
        </SectionTitle>
        {gameState?.drawn_names.length ? (
          <DrawnNamesList>
            {gameState.drawn_names.map((name, idx) => (
              <DrawnName key={idx}>{name}</DrawnName>
            ))}
          </DrawnNamesList>
        ) : (
          <InfoText>아직 뽑힌 이름이 없습니다.</InfoText>
        )}
      </Section>

      <Section>
        <SectionTitle>
          온라인 플레이어 목록 ({players.filter((p) => p.is_online).length}명)
        </SectionTitle>
        <InfoText>
          게임 시작 시 보드를 완성한 플레이어에게 자동으로 순서가 부여됩니다.
        </InfoText>
        <PlayerList>
          {players
            .filter((p) => p.is_online)
            .map((player) => (
              <PlayerItem
                key={player.id}
                isCurrentTurn={
                  gameState?.is_started &&
                  player.order === gameState.current_order
                }
              >
                <PlayerInfo>
                  <PlayerName>
                    {player.name} {player.is_admin && '👑'}
                  </PlayerName>
                  <PlayerScore>🏆 빙고: {player.score}줄</PlayerScore>
                  <PlayerStatus>
                    {player.is_online ? '🟢' : '⚪'}{' '}
                    {player.board.length === 25
                      ? '✅ 보드 완성'
                      : `⏳ 보드 ${player.board.length}/25`}
                    {player.is_ready && ' | ✅ 준비완료'}
                    {player.order > 0 && ` | 순서: ${player.order}`}
                  </PlayerStatus>
                </PlayerInfo>
                <PlayerActions>
                  <DeleteButton
                    onClick={() => handleDeletePlayer(player.id, player.name)}
                  >
                    삭제
                  </DeleteButton>
                </PlayerActions>
              </PlayerItem>
            ))}
        </PlayerList>
      </Section>
    </Container>
  );
}
