'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DrawnNamesTitle } from '../../components/BingoGame/BingoGame.styles';
import { Chat } from '../../components/Chat';
import { LoginModal } from '../../components/LoginModal/LoginModal';
import { ProfileSelectModal } from '../../components/ProfileSelectModal';
import { Ranking } from '../../components/Ranking';
import { autoLogin, updateProfileImage, type User } from '../../lib/auth';
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

interface SpectatorPanelProps {
  characterNames: string[];
  characterEnNames: string[];
}

export function SpectatorPanel({
  characterNames,
  characterEnNames,
}: SpectatorPanelProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [hasDismissedProfileSetup, setHasDismissedProfileSetup] =
    useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const result = await autoLogin();
      if (result.success && result.user) setUser(result.user);
      setIsAuthLoading(false);
    };
    void initAuth();
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const key = `genshin-bingo-selected-mode:${user.id}`;
    const stored = localStorage.getItem(key);
    if (stored === 'game') {
      router.push('/genshin-impact-bingo');
      return;
    }

    if (stored) return;

    localStorage.setItem(key, 'spectator');
  }, [router, user?.id]);

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
    });

    return () => {
      void gameSubscription.unsubscribe();
      void playersSubscription.unsubscribe();
    };
  }, []);

  const currentTurnPlayer = players.find(
    (p) => p.order === gameState?.current_order,
  );

  if (isAuthLoading || isLoading) {
    return (
      <Container>
        <Title>로딩 중...</Title>
      </Container>
    );
  }

  if (!user) {
    return (
      <LoginModal
        onLogin={(nextUser) => {
          setUser(nextUser);
          setHasDismissedProfileSetup(false);
        }}
      />
    );
  }

  const handleSelectProfile = async (englishName: string) => {
    const ok = await updateProfileImage(user.id, englishName);
    if (!ok) return;
    setUser((prev) => {
      if (!prev) return prev;
      return { ...prev, profile_image: englishName };
    });
    setShowProfileModal(false);
    setHasDismissedProfileSetup(false);
  };

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

        <Chat
          userId={user.id}
          userName={user.name}
          profileImage={user.profile_image}
          isGameStarted={gameState?.is_started}
          isSpectator={true}
        />
      </MainContent>

      <ProfileSelectModal
        isOpen={
          showProfileModal ||
          (user.profile_image === 'Arama' && !hasDismissedProfileSetup)
        }
        onClose={() => {
          setShowProfileModal(false);
          if (user.profile_image === 'Arama') setHasDismissedProfileSetup(true);
        }}
        characterNames={characterNames}
        characterEnNames={characterEnNames}
        currentProfile={user.profile_image}
        onSelect={handleSelectProfile}
      />

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
