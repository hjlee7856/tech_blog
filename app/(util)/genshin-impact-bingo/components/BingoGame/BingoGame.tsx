'use client';

import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getProfileImagePath,
  logout,
  updateProfileImage,
  type User,
} from '../../lib/auth';
import {
  agreeToStartGame,
  cancelStartRequest,
  checkAndUpdateAllScores,
  checkGameFinish,
  drawName,
  getAllPlayers,
  getOnlinePlayersRanking,
  joinGameInProgress,
  nextTurn,
  requestStartGame,
  toggleReady,
  updateOnlineStatus,
  type Player,
} from '../../lib/game';
import { BingoBoard } from '../BingoBoard/BingoBoard';
import { LoginModal } from '../LoginModal';
import { OnboardingOverlay } from '../OnboardingOverlay';
import { ProfileSelectModal } from '../ProfileSelectModal';
import { Ranking } from '../Ranking';
import {
  Container,
  CountdownNumber,
  CountdownOverlay,
  CountdownText,
  DrawButton,
  DrawnNameDisplay,
  DrawnNamesList,
  DrawnNamesSection,
  DrawnNamesTitle,
  DrawnNameTag,
  GameStatus,
  Header,
  LogoutButton,
  ProfileImage,
  ReadyButton,
  ReadySection,
  RequestStartButton,
  StatusText,
  TurnInfo,
  TurnSection,
  UserInfo,
  UserName,
} from './BingoGame.styles';
import {
  useCountdown,
  useGameData,
  useOnlineStatus,
  useStartRequest,
} from './hooks';
import {
  AloneModal,
  DrawModal,
  FinishModal,
  StartRequestModal,
} from './modals';

interface BingoGameProps {
  characterNames: string[];
  characterEnNames: string[];
}

export function BingoGame({
  characterNames,
  characterEnNames,
}: BingoGameProps) {
  // 모달 상태
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [finalRanking, setFinalRanking] = useState<Player[]>([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAloneModal, setShowAloneModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showDrawModal, setShowDrawModal] = useState(false);
  const [drawnResult, setDrawnResult] = useState<string | null>(null);
  const [drawMode, setDrawMode] = useState<'select' | 'random' | 'list'>(
    'select',
  );
  const [isDrawing, setIsDrawing] = useState(false);
  const drawnNamesListRef = useRef<HTMLDivElement>(null);

  // 카운트다운 훅
  const {
    countdown,
    countdownType,
    isCountdownStartingRef,
    setCountdown,
    setCountdownType,
    startCountdown,
  } = useCountdown(() => setShowFinishModal(false));

  // 게임 데이터 훅
  const { user, setUser, gameState, players, setPlayers, isLoading } =
    useGameData({
      onGameFinish: (ranking) => {
        setFinalRanking(ranking);
        setShowFinishModal(true);
        setCountdownType('reset');
        setCountdown(5);
      },
      onAloneInGame: () => {
        setShowAloneModal(true);
        setTimeout(() => setShowAloneModal(false), 3000);
      },
    });

  // 온라인 상태 관리 훅
  useOnlineStatus(user?.id);

  // 시작 요청 훅
  const { showStartRequestModal, startRequestRemainingTime } = useStartRequest({
    gameState,
    players,
    countdown,
    isCountdownStartingRef,
    onStartCountdown: () => startCountdown('start', 5),
  });

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

  // 게임 시작 요청
  const handleRequestStart = async () => {
    if (!user) return;
    const result = await requestStartGame(user.id);
    if (!result.success) {
      alert(result.error || '게임 시작 요청에 실패했습니다.');
    }
  };

  // 게임 시작 동의
  const handleAgreeStart = async () => {
    if (!user) return;
    const result = await agreeToStartGame(user.id);
    if (!result.success) {
      alert(result.error || '동의에 실패했습니다.');
    }
  };

  // 게임 시작 요청 취소
  const handleCancelStartRequest = useCallback(async () => {
    await cancelStartRequest();
  }, []);

  const handleDrawName = async () => {
    if (!gameState || isDrawing) return;

    setIsDrawing(true);
    setDrawnResult(null);
    const result = await drawName(characterNames, gameState.drawn_names);

    if (result.success && result.name) {
      // 뽑은 결과 저장
      setDrawnResult(result.name);

      // 점수 업데이트
      const newDrawnNames = [...gameState.drawn_names, result.name];

      // 게임 종료 체크 (25칸 완성)
      const finishResult = await checkGameFinish(newDrawnNames);
      if (finishResult.finished) {
        const ranking = await getOnlinePlayersRanking();
        setFinalRanking(ranking);
        setShowFinishModal(true);
        setShowDrawModal(false);
        setDrawnResult(null);
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
      setShowDrawModal(false);
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

  const handleJoinGame = async () => {
    if (!user) return;
    const success = await joinGameInProgress(user.id);
    if (success) {
      const playerList = await getAllPlayers();
      setPlayers(playerList);
    }
  };

  // 선택해서 뽑기
  const handleSelectDraw = async (selectedName: string) => {
    if (!gameState || isDrawing) return;

    setIsDrawing(true);
    setDrawnResult(null);

    // 선택한 이름을 drawn_names에 추가
    const newDrawnNames = [...gameState.drawn_names, selectedName];

    const { error } = await supabase
      .from('genshin-bingo-game-state')
      .update({
        drawn_names: newDrawnNames,
      })
      .eq('id', 1);

    if (!error) {
      setDrawnResult(selectedName);

      // 게임 종료 체크
      const finishResult = await checkGameFinish(newDrawnNames);
      if (finishResult.finished) {
        const ranking = await getOnlinePlayersRanking();
        setFinalRanking(ranking);
        setShowFinishModal(true);
        setShowDrawModal(false);
        setDrawnResult(null);
        setDrawMode('select');
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
      alert('이름 뽑기에 실패했습니다.');
      setShowDrawModal(false);
      setDrawMode('select');
    }

    setIsDrawing(false);
  };

  const lastDrawnName = gameState?.drawn_names.at(-1);
  const myPlayer = players.find((p) => p.id === user?.id);
  const isMyTurn =
    gameState?.is_started &&
    myPlayer &&
    myPlayer.order > 0 &&
    myPlayer.order === gameState.current_order;
  const currentTurnPlayer = players.find(
    (p) => p.order === gameState?.current_order,
  );

  // 자기 턴이 되면 자동으로 이름 뽑기 모달 열기
  useEffect(() => {
    if (isMyTurn && !isDrawing && !showDrawModal) {
      setShowDrawModal(true);
    }
  }, [isMyTurn, isDrawing, showDrawModal]);

  // 뽑은 이름 목록 자동 스크롤
  useEffect(() => {
    if (drawnNamesListRef.current) {
      drawnNamesListRef.current.scrollTop =
        drawnNamesListRef.current.scrollHeight;
    }
  }, [gameState?.drawn_names.length]);

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
      {!gameState?.is_started &&
        (() => {
          const readyPlayers = players.filter(
            (p) => p.is_online && p.is_ready && p.board.length === 25,
          );
          const canRequestStart =
            readyPlayers.length >= 2 && myPlayer?.is_ready;

          return (
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
              {canRequestStart && !gameState?.start_requested_by && (
                <RequestStartButton onClick={handleRequestStart}>
                  게임 시작 요청 ({readyPlayers.length}명 준비됨)
                </RequestStartButton>
              )}
            </ReadySection>
          );
        })()}

      {gameState?.is_started && (
        <TurnSection>
          {!isMyTurn && (
            <TurnInfo>
              {`${currentTurnPlayer?.name || '대기 중'} 님이 이름을 뽑고 있습니다.`}
            </TurnInfo>
          )}
          {isMyTurn && !showDrawModal && (
            <DrawButton
              onClick={() => setShowDrawModal(true)}
              disabled={isDrawing}
            >
              {isDrawing ? '뽑는 중...' : '이름 뽑기'}
            </DrawButton>
          )}
          {!isMyTurn &&
            myPlayer?.order === 0 &&
            myPlayer?.board.length === 25 && (
              <>
                <TurnInfo>게임 중간 참여가 가능합니다!</TurnInfo>
                <DrawButton onClick={handleJoinGame}>게임 참여하기</DrawButton>
              </>
            )}
          {!isMyTurn &&
            myPlayer?.order === 0 &&
            myPlayer?.board.length !== 25 && (
              <TurnInfo>
                보드를 완성하면 게임에 참여할 수 있습니다 (
                {myPlayer?.board.length ?? 0}/25)
              </TurnInfo>
            )}
        </TurnSection>
      )}

      <BingoBoard
        characterNames={characterNames}
        characterEnNames={characterEnNames}
        userId={user.id}
        isGameStarted={gameState?.is_started ?? false}
        drawnNames={gameState?.drawn_names ?? []}
        playerOrder={myPlayer?.order ?? 0}
      />

      {/* 뽑은 이름 목록 */}
      {gameState?.is_started && gameState.drawn_names.length > 0 && (
        <DrawnNamesSection>
          <DrawnNamesTitle>
            뽑은 이름 ({gameState.drawn_names.length}개)
          </DrawnNamesTitle>
          <DrawnNamesList ref={drawnNamesListRef}>
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

      <Ranking isGameStarted={gameState?.is_started} />

      {/* 이름 뽑기 모달 */}
      <DrawModal
        isOpen={!!gameState?.is_started && showDrawModal}
        drawnResult={drawnResult}
        drawMode={drawMode}
        isDrawing={isDrawing}
        remainingNames={characterNames.filter(
          (name) => !gameState?.drawn_names.includes(name),
        )}
        myBoardNames={new Set(myPlayer?.board || [])}
        onClose={() => {
          setShowDrawModal(false);
          setDrawnResult(null);
          setDrawMode('select');
        }}
        onRandomDraw={() => void handleDrawName()}
        onSelectDraw={(name) => void handleSelectDraw(name)}
        onSetDrawMode={setDrawMode}
      />

      {/* 게임 종료 모달 */}
      <FinishModal
        isOpen={showFinishModal}
        finalRanking={finalRanking}
        userId={user.id}
        countdown={countdown}
        countdownType={countdownType}
      />

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
      <AloneModal isOpen={showAloneModal} />

      {/* 게임 시작 요청 모달 */}
      <StartRequestModal
        isOpen={
          showStartRequestModal &&
          !!gameState?.start_requested_by &&
          !gameState.is_started
        }
        requesterName={
          players.find((p) => p.id === gameState?.start_requested_by)?.name ||
          '알 수 없음'
        }
        readyOnlinePlayers={players.filter(
          (p) => p.is_online && p.is_ready && p.board.length === 25,
        )}
        agreedUsers={gameState?.start_agreed_users || []}
        hasAgreed={
          user ? (gameState?.start_agreed_users || []).includes(user.id) : false
        }
        isRequester={user?.id === gameState?.start_requested_by}
        remainingTime={startRequestRemainingTime}
        onAgree={handleAgreeStart}
        onCancel={handleCancelStartRequest}
      />

      {/* 온보딩 오버레이 */}
      {showOnboarding && (
        <OnboardingOverlay onComplete={() => setShowOnboarding(false)} />
      )}
    </Container>
  );
}
