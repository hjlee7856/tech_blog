'use client';

import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  getProfileImagePath,
  logout,
  updateProfileImage,
  type User,
} from '../../lib/auth';
import {
  checkAndUpdateAllScores,
  checkGameFinish,
  getAllPlayers,
  getOnlinePlayersRanking,
  joinGameInProgress,
  nextTurn,
  resetGame,
  startGame,
  toggleReady,
  updateOnlineStatus,
  type Player,
} from '../../lib/game';
import { BingoBoard, type BingoBoardActions } from '../BingoBoard/BingoBoard';
import { LoginModal } from '../LoginModal';
import { ProfileSelectModal } from '../ProfileSelectModal';
import { Ranking } from '../Ranking';
import {
  AdminResetButton,
  BoardActionButton,
  BoardActionDangerButton,
  BoardActions,
  ConfirmDialog,
  ConfirmDialogButtons,
  ConfirmDialogText,
  ConfirmDialogTitle,
  Container,
  DrawButton,
  DrawnNameDisplay,
  DrawnNamesList,
  DrawnNamesSection,
  DrawnNamesTitle,
  DrawnNameTag,
  GameStatus,
  Header,
  LogoutButton,
  ModalOverlay,
  ProfileImage,
  ReadyButton,
  ReadySection,
  ResetButton,
  RestartButton,
  StatusText,
  TurnInfo,
  TurnSection,
  UserInfo,
  UserName,
} from './BingoGame.styles';

import { Chat } from '../Chat';
import { useGameData, useOnlineStatus } from './hooks';
import { AloneModal, FinishModal } from './modals';

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
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showBoardClearConfirm, setShowBoardClearConfirm] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [boardActions, setBoardActions] = useState<BingoBoardActions | null>(
    null,
  );
  const drawnNamesListRef = useRef<HTMLDivElement>(null);

  // 콜백 메모이제이션 (재구독 방지)
  const handleGameFinish = useCallback((ranking: Player[]) => {
    setFinalRanking(ranking);
    setShowFinishModal(true);
  }, []);

  const handleAloneInGame = useCallback(() => {
    setShowAloneModal(true);
    setTimeout(() => setShowAloneModal(false), 3000);
  }, []);

  // 게임 데이터 훅
  const gameDataCallbacks = useMemo(
    () => ({
      onGameFinish: handleGameFinish,
      onAloneInGame: handleAloneInGame,
    }),
    [handleGameFinish, handleAloneInGame],
  );

  const { user, setUser, gameState, players, setPlayers, isLoading } =
    useGameData(gameDataCallbacks);

  // 온라인 상태 관리 훅
  useOnlineStatus(user?.id);

  // 2명 이상 준비 시 바로 시작
  const isStartingRef = useRef(false);
  useEffect(() => {
    if (!gameState || gameState.is_started) return;
    if (isStartingRef.current) return;

    const readyOnlinePlayers = players.filter(
      (p) => p.is_online && p.is_ready && p.board.length === 25,
    );

    if (readyOnlinePlayers.length >= 2) {
      isStartingRef.current = true;
      void startGame().finally(() => {
        isStartingRef.current = false;
      });
    }
  }, [gameState, players]);

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

    // 선택한 이름을 drawn_names에 추가
    const newDrawnNames = [...gameState.drawn_names, selectedName];

    const { error } = await supabase
      .from('genshin-bingo-game-state')
      .update({
        drawn_names: newDrawnNames,
      })
      .eq('id', 1);

    if (!error) {
      // 게임 종료 체크
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
      alert('이름 뽑기에 실패했습니다.');
    }

    setIsDrawing(false);
  };

  // 관리자 게임 초기화
  const handleResetGame = async () => {
    setIsResetting(true);
    await resetGame();
    setShowResetConfirm(false);
    setIsResetting(false);
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

  // 다음 턴 플레이어 계산
  const nextTurnPlayer = useMemo(() => {
    if (!gameState?.is_started) return null;
    const activePlayers = players
      .filter((p) => p.order > 0 && p.is_online)
      .toSorted((a, b) => a.order - b.order);
    if (activePlayers.length === 0) return null;

    const currentIdx = activePlayers.findIndex(
      (p) => p.order === gameState.current_order,
    );
    const nextIdx = (currentIdx + 1) % activePlayers.length;
    return activePlayers[nextIdx];
  }, [gameState, players]);

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

      {/* 게임 대기 중일 때 준비 섹션 */}
      {!gameState?.is_started && (
        <ReadySection>
          <GameStatus>
            <StatusText isReady={myPlayer?.is_ready}>
              {myPlayer?.is_ready
                ? '다른 유저를 기다리는 중'
                : '보드를 채우고 준비 버튼을 눌러주세요!'}
            </StatusText>
          </GameStatus>
          <BoardActions>
            {!myPlayer?.is_ready && (
              <BoardActionButton onClick={() => boardActions?.fillRandom()}>
                랜덤 채우기
              </BoardActionButton>
            )}
            <ReadyButton
              isReady={myPlayer?.is_ready ?? false}
              onClick={handleToggleReady}
              disabled={myPlayer?.board.length !== 25}
            >
              {myPlayer?.is_ready ? '준비 완료!' : '준비하기'}
            </ReadyButton>
            {!myPlayer?.is_ready && myPlayer?.board.length === 25 && (
              <BoardActionDangerButton
                onClick={() => setShowBoardClearConfirm(true)}
              >
                보드 초기화
              </BoardActionDangerButton>
            )}
          </BoardActions>
        </ReadySection>
      )}

      {/* 게임 진행 중일 때 턴 섹션 */}
      {gameState?.is_started && (
        <TurnSection>
          <GameStatus>
            <StatusText isReady={false}>게임 진행 중</StatusText>
            {lastDrawnName && (
              <DrawnNameDisplay isLatest>
                마지막 뽑힌 이름: <strong>{lastDrawnName}</strong>
              </DrawnNameDisplay>
            )}
          </GameStatus>
          <TurnInfo>
            현재 턴:{' '}
            <strong style={{ color: '#3BA55C' }}>
              {currentTurnPlayer?.name || '대기 중'}
            </strong>
            {nextTurnPlayer && nextTurnPlayer.id !== currentTurnPlayer?.id && (
              <>
                → 다음 턴:{' '}
                <strong style={{ color: '#5865F2' }}>
                  {nextTurnPlayer.name}
                </strong>
              </>
            )}
          </TurnInfo>

          {isMyTurn && (
            <TurnInfo isMyTurn>
              이름을 뽑을 차례입니다!{'\n'}보드에서 이름을 선택하세요.
            </TurnInfo>
          )}
          {!isMyTurn && myPlayer?.order !== 0 && (
            <TurnInfo>
              <strong style={{ color: '#FFD700' }}>
                {currentTurnPlayer?.name || '대기 중'}
              </strong>
              {` 님이 이름을 뽑고 있습니다.`}
            </TurnInfo>
          )}
          {!isMyTurn &&
            myPlayer?.order === 0 &&
            myPlayer?.board.length === 25 && (
              <>
                <TurnInfo>현재 게임이 진행 중 입니다!</TurnInfo>
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
        isMyTurn={isMyTurn ?? false}
        isDrawing={isDrawing}
        onSelectForDraw={(name) => void handleSelectDraw(name)}
        onRegisterActions={setBoardActions}
      />

      {/* 채팅 */}
      <Chat
        userId={user.id}
        userName={user.name}
        profileImage={user.profile_image}
        myScore={myPlayer?.score}
        isGameStarted={gameState?.is_started}
      />

      {/* 실시간 순위 목록 */}
      <Ranking isGameStarted={gameState?.is_started} userId={user.id} />

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

      {/* 게임 종료 모달 */}
      <FinishModal
        isOpen={showFinishModal}
        finalRanking={finalRanking}
        userId={user.id}
        isAdmin={user.is_admin}
        onReset={() => setShowFinishModal(false)}
      />

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

      {/* 관리자 게임 초기화 버튼 */}
      {user.is_admin && !gameState?.is_started && (
        <AdminResetButton onClick={() => setShowResetConfirm(true)}>
          게임 초기화
        </AdminResetButton>
      )}

      {/* 보드 초기화 확인 모달 */}
      {showBoardClearConfirm && (
        <ModalOverlay>
          <ConfirmDialog>
            <ConfirmDialogTitle>보드 초기화</ConfirmDialogTitle>
            <ConfirmDialogText>
              현재 보드의 모든 캐릭터가 삭제됩니다. {'\n'}계속하시겠습니까?
            </ConfirmDialogText>
            <ConfirmDialogButtons>
              <ResetButton
                onClick={() => {
                  boardActions?.clearAll();
                  setShowBoardClearConfirm(false);
                }}
              >
                초기화
              </ResetButton>
              <RestartButton
                onClick={() => setShowBoardClearConfirm(false)}
                style={{ backgroundColor: '#3F4147' }}
              >
                취소
              </RestartButton>
            </ConfirmDialogButtons>
          </ConfirmDialog>
        </ModalOverlay>
      )}

      {/* 게임 초기화 확인 모달 */}
      {showResetConfirm && (
        <ModalOverlay>
          <ConfirmDialog>
            <ConfirmDialogTitle>게임 초기화</ConfirmDialogTitle>
            <ConfirmDialogText>
              모든 플레이어의 보드와 점수가 초기화됩니다. 계속하시겠습니까?
            </ConfirmDialogText>
            <ConfirmDialogButtons>
              <ResetButton
                onClick={() => void handleResetGame()}
                disabled={isResetting}
              >
                {isResetting ? '초기화 중...' : '초기화'}
              </ResetButton>
              <RestartButton
                onClick={() => setShowResetConfirm(false)}
                disabled={isResetting}
                style={{ backgroundColor: '#3F4147' }}
              >
                취소
              </RestartButton>
            </ConfirmDialogButtons>
          </ConfirmDialog>
        </ModalOverlay>
      )}
    </Container>
  );
}
