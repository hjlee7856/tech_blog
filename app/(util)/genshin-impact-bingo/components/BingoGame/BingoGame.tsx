'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  autoLogin,
  getProfileImagePath,
  logout,
  updateProfileImage,
  type User,
} from '../../lib/auth';
import {
  checkAndUpdateAllScores,
  checkGameFinish,
  drawName,
  getAllPlayers,
  getGameState,
  getOnlinePlayersRanking,
  nextTurn,
  subscribeToGameState,
  subscribeToPlayers,
  toggleReady,
  updateOnlineStatus,
  type GameState,
  type Player,
} from '../../lib/game';
import { BingoBoard } from '../BingoBoard/BingoBoard';
import { LoginModal } from '../LoginModal';
import { ProfileSelectModal } from '../ProfileSelectModal';
import { Ranking } from '../Ranking';
import {
  CloseButton,
  Container,
  DrawButton,
  DrawnNameDisplay,
  DrawnResult,
  DrawnResultName,
  GameStatus,
  Header,
  LogoutButton,
  ModalContent,
  ModalOverlay,
  ModalTitle,
  ProfileImage,
  RankingItem,
  RankingList,
  ReadyButton,
  ReadySection,
  StatusText,
  TurnInfo,
  TurnSection,
  UserInfo,
  UserName,
  WinnerName,
} from './BingoGame.styles';

interface BingoGameProps {
  characterNames: string[];
  characterEnNames: string[];
}

export function BingoGame({
  characterNames,
  characterEnNames,
}: BingoGameProps) {
  const [user, setUser] = useState<User | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [drawnName, setDrawnName] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [finalRanking, setFinalRanking] = useState<Player[]>([]);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // 초기 데이터 로드 및 구독
  useEffect(() => {
    const init = async () => {
      const [authResult, state, playerList] = await Promise.all([
        autoLogin(),
        getGameState(),
        getAllPlayers(),
      ]);
      if (authResult.success && authResult.user) {
        setUser(authResult.user);
        await updateOnlineStatus(authResult.user.id, true);
      }
      setGameState(state);
      setPlayers(playerList);
      setIsLoading(false);
    };
    void init();

    const gameSubscription = subscribeToGameState(async (state) => {
      setGameState(state);
      setDrawnName(null);
      if (state.is_finished && state.winner_id) {
        const ranking = await getOnlinePlayersRanking();
        setFinalRanking(ranking);
        setShowFinishModal(true);
      }
    });

    const playersSubscription = subscribeToPlayers((playerList) => {
      setPlayers(playerList);
    });

    return () => {
      void gameSubscription.unsubscribe();
      void playersSubscription.unsubscribe();
    };
  }, []);

  // 온라인 상태 관리 (user가 설정된 후에만)
  useEffect(() => {
    if (!user) return;

    const handleVisibilityChange = () => {
      void updateOnlineStatus(user.id, document.visibilityState === 'visible');
    };

    const handleBeforeUnload = () => {
      void updateOnlineStatus(user.id, false);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user]);

  const handleLogin = async (loggedInUser: User) => {
    setUser(loggedInUser);
    await updateOnlineStatus(loggedInUser.id, true);
  };

  const handleLogout = async () => {
    if (user) {
      await updateOnlineStatus(user.id, false);
    }
    logout();
    setUser(null);
  };

  const handleToggleReady = async () => {
    if (!user) return;
    await toggleReady(user.id);
    const playerList = await getAllPlayers();
    setPlayers(playerList);
  };

  const handleDrawName = async () => {
    if (!gameState || isDrawing) return;

    setIsDrawing(true);
    const result = await drawName(characterNames, gameState.drawn_names);

    if (result.success && result.name) {
      setDrawnName(result.name);
      // 점수 업데이트
      const newDrawnNames = [...gameState.drawn_names, result.name];

      // 게임 종료 체크 (25칸 완성)
      const finishResult = await checkGameFinish(newDrawnNames);
      if (finishResult.finished) {
        const ranking = await getOnlinePlayersRanking();
        setFinalRanking(ranking);
        setShowFinishModal(true);
        setIsDrawing(false);
        return;
      }

      await checkAndUpdateAllScores(newDrawnNames);

      // 다음 턴으로
      const activePlayers = players.filter((p) => p.order > 0 && p.is_online);
      if (activePlayers.length > 0) {
        await nextTurn(activePlayers.length);
      }
    } else {
      alert(result.error || '이름 뽑기에 실패했습니다.');
    }

    setIsDrawing(false);
  };

  const handleProfileChange = async (englishName: string) => {
    if (!user) return;
    const success = await updateProfileImage(user.id, englishName);
    if (success) {
      setUser({ ...user, profile_image: englishName });
    }
  };

  if (isLoading) {
    return (
      <Container style={{ minHeight: '100vh' }}>
        <p style={{ color: 'white' }}>로딩 중...</p>
      </Container>
    );
  }

  if (!user) {
    return <LoginModal onLogin={handleLogin} />;
  }

  const lastDrawnName = gameState?.drawn_names.at(-1);
  const myPlayer = players.find((p) => p.id === user.id);
  const isMyTurn =
    gameState?.is_started &&
    myPlayer &&
    myPlayer.order > 0 &&
    myPlayer.order === gameState.current_order;
  const currentTurnPlayer = players.find(
    (p) => p.order === gameState?.current_order,
  );

  return (
    <Container>
      <Header>
        <UserInfo>
          <ProfileImage
            onClick={() => setShowProfileModal(true)}
            style={{ cursor: 'pointer' }}
            title="프로필 사진 변경"
          >
            <Image
              src={getProfileImagePath(user.profile_image || 'Nahida')}
              alt={user.name}
              width={36}
              height={36}
              style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
          </ProfileImage>
          <UserName>{user.name}</UserName>
          <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
        </UserInfo>
      </Header>

      <GameStatus>
        <StatusText isStarted={gameState?.is_started ?? false}>
          {gameState?.is_started
            ? '🎮 게임 진행 중'
            : '⏳ 게임 대기 중 - 보드를 채워주세요!'}
        </StatusText>
        {gameState?.is_started && lastDrawnName && (
          <DrawnNameDisplay>
            🎲 마지막 뽑힌 이름: <strong>{lastDrawnName}</strong>
          </DrawnNameDisplay>
        )}
      </GameStatus>

      {/* 게임 대기 중일 때 준비 섹션 */}
      {!gameState?.is_started && (
        <ReadySection>
          <ReadyButton
            isReady={myPlayer?.is_ready ?? false}
            onClick={handleToggleReady}
            disabled={myPlayer?.board.length !== 25}
          >
            {myPlayer?.board.length !== 25
              ? `보드를 먼저 완성해주세요 (${myPlayer?.board.length ?? 0}/25)`
              : myPlayer?.is_ready
                ? '✅ 준비 완료!'
                : '🎮 준비하기'}
          </ReadyButton>
        </ReadySection>
      )}

      {gameState?.is_started && (
        <TurnSection>
          <TurnInfo isMyTurn={isMyTurn}>
            {isMyTurn
              ? '🎉 당신의 차례입니다!'
              : `${currentTurnPlayer?.name || '대기 중'}이 이름을 뽑고 있습니다.`}
          </TurnInfo>
          {isMyTurn && (
            <>
              <DrawButton onClick={handleDrawName} disabled={isDrawing}>
                {isDrawing ? '뽑는 중...' : '🎲 이름 뽑기'}
              </DrawButton>
              {drawnName && (
                <DrawnResult>
                  <span>뽑힌 이름:</span>
                  <DrawnResultName>{drawnName}</DrawnResultName>
                </DrawnResult>
              )}
            </>
          )}
          {!isMyTurn && myPlayer?.order === 0 && (
            <TurnInfo>⚠️ 보드를 완성하지 않아 참가하지 못했습니다</TurnInfo>
          )}
        </TurnSection>
      )}

      <BingoBoard
        characterNames={characterNames}
        characterEnNames={characterEnNames}
        userId={user.id}
        isGameStarted={gameState?.is_started ?? false}
        drawnNames={gameState?.drawn_names ?? []}
      />

      <Ranking isGameStarted={gameState?.is_started} />

      {/* 게임 종료 모달 */}
      {showFinishModal &&
        (() => {
          // 공동 순위 계산
          const getRank = (index: number, players: Player[]) => {
            if (index === 0) return 1;
            const prevPlayer = players[index - 1];
            const currentPlayer = players[index];
            if (
              prevPlayer &&
              currentPlayer &&
              prevPlayer.score === currentPlayer.score
            ) {
              return getRank(index - 1, players);
            }
            return index + 1;
          };

          const top3 = finalRanking.slice(0, 3);
          const isWinner = top3[0]?.id === user.id;

          return (
            <ModalOverlay>
              <ModalContent>
                <ModalTitle>🎉 게임 종료!</ModalTitle>
                {isWinner && (
                  <WinnerName>
                    🎊 축하합니다! 당신이 우승했습니다! 🎊
                  </WinnerName>
                )}
                <RankingList>
                  {top3.map((player, index) => {
                    const rank = getRank(index, finalRanking);
                    return (
                      <RankingItem
                        key={player.id}
                        rank={rank <= 3 ? (rank as 1 | 2 | 3) : undefined}
                      >
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
                          <Image
                            src={getProfileImagePath(
                              player.profile_image || 'Nahida',
                            )}
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
                <CloseButton onClick={() => setShowFinishModal(false)}>
                  닫기
                </CloseButton>
              </ModalContent>
            </ModalOverlay>
          );
        })()}

      {/* 프로필 변경 모달 */}
      <ProfileSelectModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        characterNames={characterNames}
        characterEnNames={characterEnNames}
        currentProfile={user.profile_image || 'Nahida'}
        onSelect={handleProfileChange}
      />
    </Container>
  );
}
