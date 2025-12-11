import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { autoLogin, type User } from '../../../lib/auth';
import {
  getAllPlayers,
  getGameState,
  getOnlinePlayersRanking,
  nextTurn,
  subscribeToGameState,
  subscribeToPlayers,
  updateOnlineStatus,
  type GameState,
  type Player,
} from '../../../lib/game';
import { useBingoStore } from '../../../store/bingo-store';

interface UseGameDataProps {
  onGameFinish: (ranking: Player[]) => void;
  onAloneInGame: () => void;
}

interface UseGameDataReturn {
  user: User | null;
  setUser: (user: User | null) => void;
  gameState: GameState | null;
  players: Player[];
  setPlayers: (players: Player[]) => void;
  isLoading: boolean;
  hasReportedOnline: boolean;
}

export function useGameData({
  onGameFinish,
  onAloneInGame,
}: UseGameDataProps): UseGameDataReturn {
  const {
    user,
    gameState,
    players,
    isLoading,
    hasInitialized,
    hasReportedOnline,
    setUser,
    setGameState,
    setPlayers,
    setIsLoading,
    setInitialized,
    setHasReportedOnline,
  } = useBingoStore();

  const isSkippingTurnRef = useRef(false);
  const skipTurnTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onGameFinishRef = useRef(onGameFinish);
  const onAloneInGameRef = useRef(onAloneInGame);

  useEffect(() => {
    onGameFinishRef.current = onGameFinish;
  }, [onGameFinish]);

  useEffect(() => {
    onAloneInGameRef.current = onAloneInGame;
  }, [onAloneInGame]);

  const initQuery = useQuery({
    queryKey: ['genshin-bingo', 'init'],
    queryFn: async () => {
      const [authResult, state, playerList] = await Promise.all([
        autoLogin(),
        getGameState(),
        getAllPlayers(),
      ]);

      return { authResult, state, playerList };
    },
    staleTime: 1000,
    enabled: !hasInitialized,
  });

  useEffect(() => {
    if (!initQuery.data || hasInitialized) return;

    const { authResult, state, playerList } = initQuery.data;

    const applyInit = async () => {
      if (authResult.success && authResult.user) {
        setUser(authResult.user);
        const updated = await updateOnlineStatus(authResult.user.id, true);
        if (updated) setHasReportedOnline();
      }

      setGameState(state);
      setPlayers(playerList);
      setIsLoading(false);
      setInitialized();
    };

    void applyInit();
  }, [
    hasInitialized,
    initQuery.data,
    setGameState,
    setInitialized,
    setIsLoading,
    setPlayers,
    setUser,
    setHasReportedOnline,
  ]);

  useEffect(() => {
    const gameSubscription = subscribeToGameState(async (state) => {
      setGameState(state);
      if (state.is_finished && state.winner_id) {
        const ranking = await getOnlinePlayersRanking();
        onGameFinishRef.current(ranking);
      }
    });

    const playersSubscription = subscribeToPlayers((playerList) => {
      setPlayers(playerList);
      void checkAndSkipInvalidTurn(playerList);
    });

    return () => {
      void gameSubscription.unsubscribe();
      void playersSubscription.unsubscribe();
    };

    async function checkAndSkipInvalidTurn(playerList: Player[]) {
      if (isSkippingTurnRef.current) return;

      if (skipTurnTimeoutRef.current) {
        clearTimeout(skipTurnTimeoutRef.current);
      }

      skipTurnTimeoutRef.current = setTimeout(async () => {
        if (isSkippingTurnRef.current) return;

        const state = await getGameState();
        if (!state?.is_started || state.is_finished) return;

        const currentTurnPlayer = playerList.find(
          (p) => p.order === state.current_order,
        );

        const shouldSkip = !currentTurnPlayer || currentTurnPlayer.order <= 0;

        if (shouldSkip) {
          isSkippingTurnRef.current = true;
          await nextTurn();
          setTimeout(() => {
            isSkippingTurnRef.current = false;
          }, 500);
        }
      }, 300);
    }
  }, [setGameState, setPlayers]);

  return {
    user,
    setUser,
    gameState,
    players,
    setPlayers,
    isLoading,
    hasReportedOnline,
  };
}
