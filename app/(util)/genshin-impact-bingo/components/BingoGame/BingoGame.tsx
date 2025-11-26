/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
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
  resetGame,
  startGame,
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
  Container,
  CountdownNumber,
  CountdownOverlay,
  CountdownText,
  DrawButton,
  DrawnNameDisplay,
  GameStatus,
  Header,
  LogoutButton,
  ModalContent,
  ModalOverlay,
  ModalTitle,
  MyRankDisplay,
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
  const [isDrawing, setIsDrawing] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [finalRanking, setFinalRanking] = useState<Player[]>([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [countdownType, setCountdownType] = useState<'start' | 'reset' | null>(
    null,
  );
  const [showAloneModal, setShowAloneModal] = useState(false);
  const isCountdownStartingRef = useRef(false);

  // 모든 플레이어가 준비되었는지 체크하고 게임 시작 카운트다운
  useEffect(() => {
    if (!gameState || gameState.is_started || gameState.is_finished) return;
    // 이미 카운트다운 중이면 중복 실행 방지 (ref로 동기적 체크)
    if (countdown !== null || isCountdownStartingRef.current) return;

    const onlinePlayers = players.filter((p) => p.is_online);
    const readyPlayers = onlinePlayers.filter(
      (p) => p.is_ready && p.board.length === 25,
    );

    // 2명 이상이고 모든 온라인 플레이어가 준비 완료
    if (
      onlinePlayers.length >= 2 &&
      readyPlayers.length === onlinePlayers.length
    ) {
      isCountdownStartingRef.current = true;
      setCountdownType('start');
      setCountdown(3);
    }
  }, [players, gameState, countdown]);

  // 카운트다운 타이머
  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      if (countdownType === 'start') {
        void startGame();
      } else if (countdownType === 'reset') {
        void resetGame();
        setShowFinishModal(false);
      }
      setCountdown(null);
      setCountdownType(null);
      isCountdownStartingRef.current = false;
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, countdownType]);

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
      if (state.is_finished && state.winner_id) {
        const ranking = await getOnlinePlayersRanking();
        setFinalRanking(ranking);
        setShowFinishModal(true);
        // 게임 종료 후 3초 카운트다운 시작
        setCountdownType('reset');
        setCountdown(3);
      }
    });

    const playersSubscription = subscribeToPlayers((playerList) => {
      setPlayers(playerList);

      // 게임 진행 중 온라인 유저가 1명만 남으면 게임 종료
      const onlineActivePlayers = playerList.filter(
        (p) => p.is_online && p.order > 0,
      );
      if (onlineActivePlayers.length <= 1) {
        void getGameState().then((state) => {
          if (state?.is_started && !state.is_finished) {
            setShowAloneModal(true);
            void resetGame();
            setTimeout(() => {
              setShowAloneModal(false);
            }, 3000);
          }
        });
      }
    });

    return () => {
      void gameSubscription.unsubscribe();
      void playersSubscription.unsubscribe();
    };
  }, []);

  // 온라인 상태 관리 (user가 설정된 후에만)
  useEffect(() => {
    if (!user) return;

    let hiddenTime: number | null = null;
    const LOGOUT_TIMEOUT = 60 * 1000; // 1분

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        hiddenTime = Date.now();
      } else if (
        document.visibilityState === 'visible' &&
        hiddenTime !== null
      ) {
        const elapsed = Date.now() - hiddenTime;
        if (elapsed >= LOGOUT_TIMEOUT) {
          // 1분 이상 안 봤으면 로그아웃
          void updateOnlineStatus(user.id, false);
          logout();
          setUser(null);
        }
        hiddenTime = null;
      }
    };

    const handleBeforeUnload = () => {
      void updateOnlineStatus(user.id, false);
      logout();
      setUser(null);
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
            ? '게임 진행 중'
            : `게임 대기 중 - ${myPlayer?.is_ready ? '다른 유저를 기다리는 중' : '보드를 채워주세요!'}`}
        </StatusText>
        {gameState?.is_started && lastDrawnName && (
          <DrawnNameDisplay isLatest>
            마지막 뽑힌 이름: <strong>{lastDrawnName}</strong>
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
                ? '준비 완료!'
                : '준비하기'}
          </ReadyButton>
        </ReadySection>
      )}

      {gameState?.is_started && (
        <TurnSection>
          <TurnInfo isMyTurn={isMyTurn}>
            {isMyTurn
              ? '당신의 차례입니다!'
              : `${currentTurnPlayer?.name || '대기 중'} 님이 이름을 뽑고 있습니다.`}
          </TurnInfo>
          {isMyTurn && (
            <DrawButton onClick={handleDrawName} disabled={isDrawing}>
              {isDrawing ? '뽑는 중...' : '이름 뽑기'}
            </DrawButton>
          )}
          {!isMyTurn && myPlayer?.order === 0 && (
            <TurnInfo>보드를 완성하지 않아 참가하지 못했습니다</TurnInfo>
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

          // 공동 3등까지 포함하여 표시할 플레이어 목록
          const topPlayers = finalRanking.filter((_, index) => {
            const rank = getRank(index, finalRanking);
            return rank <= 3;
          });
          const isWinner = finalRanking[0]?.id === user.id;

          // 내 순위 찾기
          const myIndex = finalRanking.findIndex((p) => p.id === user.id);
          const myRank = myIndex !== -1 ? getRank(myIndex, finalRanking) : null;
          const isInTop3 = myRank !== null && myRank <= 3;

          return (
            <ModalOverlay>
              <ModalContent>
                <ModalTitle>게임 종료!</ModalTitle>
                {isWinner && (
                  <WinnerName>축하합니다! 순위를 확인하세요!</WinnerName>
                )}
                <RankingList>
                  {topPlayers.map((player) => {
                    const playerIndex = finalRanking.findIndex(
                      (p) => p.id === player.id,
                    );
                    const rank = getRank(playerIndex, finalRanking);
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

                {/* 내 순위 표시 (3등 안에 없을 때만) */}
                {myRank !== null && !isInTop3 && (
                  <MyRankDisplay>
                    내 순위: {myRank}위 ({finalRanking[myIndex]?.score ?? 0}줄)
                  </MyRankDisplay>
                )}

                {/* 카운트다운 표시 */}
                {countdown !== null && countdownType === 'reset' && (
                  <CountdownText
                    style={{ marginTop: '16px', color: '#FAA61A' }}
                  >
                    {countdown}초 후 처음으로 돌아갑니다...
                  </CountdownText>
                )}
              </ModalContent>
            </ModalOverlay>
          );
        })()}

      {/* 게임 시작 카운트다운 오버레이 */}
      {countdown !== null && countdownType === 'start' && (
        <CountdownOverlay>
          <CountdownNumber key={countdown}>{countdown}</CountdownNumber>
          <CountdownText>게임이 곧 시작됩니다!</CountdownText>
        </CountdownOverlay>
      )}

      {/* 프로필 변경 모달 */}
      <ProfileSelectModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        characterNames={characterNames}
        characterEnNames={characterEnNames}
        currentProfile={user.profile_image || 'Aino'}
        onSelect={handleProfileChange}
      />

      {/* 혼자 남음 모달 */}
      {showAloneModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>게임 종료</ModalTitle>
            <WinnerName>
              다른 플레이어가 모두 나가서 게임이 종료되었습니다.
            </WinnerName>
            <CountdownText style={{ color: '#FAA61A' }}>
              잠시 후 처음으로 돌아갑니다...
            </CountdownText>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}
