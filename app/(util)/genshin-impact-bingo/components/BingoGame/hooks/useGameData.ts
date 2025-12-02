import { useEffect, useRef, useState } from 'react';
import { autoLogin, type User } from '../../../lib/auth';
import {
  getAllPlayers,
  getGameState,
  getOnlinePlayersRanking,
  nextTurn,
  resetGame,
  subscribeToGameState,
  subscribeToPlayers,
  updateOnlineStatus,
  type GameState,
  type Player,
} from '../../../lib/game';

interface UseGameDataProps {
  onGameFinish: (ranking: Player[]) => void;
  onAloneInGame: () => void;
}

interface UseGameDataReturn {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  gameState: GameState | null;
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  isLoading: boolean;
}

export function useGameData({
  onGameFinish,
  onAloneInGame,
}: UseGameDataProps): UseGameDataReturn {
  const [user, setUser] = useState<User | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 중복 호출 방지용 ref
  const isResettingRef = useRef(false);
  const isSkippingTurnRef = useRef(false);

  // 콜백을 ref로 저장하여 의존성 배열에서 제거 (재구독 방지)
  const onGameFinishRef = useRef(onGameFinish);
  const onAloneInGameRef = useRef(onAloneInGame);

  // 콜백이 변경되면 ref 업데이트
  useEffect(() => {
    onGameFinishRef.current = onGameFinish;
  }, [onGameFinish]);

  useEffect(() => {
    onAloneInGameRef.current = onAloneInGame;
  }, [onAloneInGame]);

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
        onGameFinishRef.current(ranking);
      }
    });

    const playersSubscription = subscribeToPlayers((playerList) => {
      setPlayers(playerList);

      const onlineActivePlayers = playerList.filter(
        (p) => p.is_online && p.order > 0,
      );

      // 혼자 남으면 게임 리셋 (중복 호출 방지)
      if (onlineActivePlayers.length <= 1) {
        void getGameState().then((state) => {
          if (
            state?.is_started &&
            !state.is_finished &&
            !isResettingRef.current
          ) {
            isResettingRef.current = true;
            onAloneInGameRef.current();
            void resetGame().finally(() => {
              setTimeout(() => {
                isResettingRef.current = false;
              }, 1000);
            });
          }
        });
        return;
      }

      // 오프라인 플레이어 턴 스킵 (중복 호출 방지)
      void getGameState().then((state) => {
        if (
          state?.is_started &&
          !state.is_finished &&
          !isSkippingTurnRef.current
        ) {
          const currentTurnPlayer = playerList.find(
            (p) => p.order === state.current_order,
          );
          if (currentTurnPlayer && !currentTurnPlayer.is_online) {
            isSkippingTurnRef.current = true;
            void nextTurn().finally(() => {
              setTimeout(() => {
                isSkippingTurnRef.current = false;
              }, 1000);
            });
          }
        }
      });
    });

    return () => {
      void gameSubscription.unsubscribe();
      void playersSubscription.unsubscribe();
    };
  }, []); // 의존성 배열 비움 - 콜백은 ref로 관리

  return { user, setUser, gameState, players, setPlayers, isLoading };
}
