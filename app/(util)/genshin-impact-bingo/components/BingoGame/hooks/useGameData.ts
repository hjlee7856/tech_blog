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

      // 오프라인이거나 게임 미참여(order=0) 플레이어 턴 스킵
      void checkAndSkipInvalidTurn(playerList);
    });

    // 3초마다 턴 체크 (잘못된 턴 수정)
    const turnCheckInterval = setInterval(() => {
      void getAllPlayers().then((playerList) => {
        void checkAndSkipInvalidTurn(playerList);
      });
    }, 3000);

    return () => {
      void gameSubscription.unsubscribe();
      void playersSubscription.unsubscribe();
      clearInterval(turnCheckInterval);
    };

    // 유효하지 않은 턴 스킵 함수
    async function checkAndSkipInvalidTurn(playerList: Player[]) {
      if (isSkippingTurnRef.current) return;

      const state = await getGameState();
      if (!state?.is_started || state.is_finished) return;

      const currentTurnPlayer = playerList.find(
        (p) => p.order === state.current_order,
      );

      // 현재 턴 플레이어가 없거나, 오프라인이거나, 게임 미참여(order=0)인 경우 스킵
      const shouldSkip =
        !currentTurnPlayer ||
        !currentTurnPlayer.is_online ||
        currentTurnPlayer.order === 0;

      if (shouldSkip) {
        isSkippingTurnRef.current = true;
        await nextTurn();
        setTimeout(() => {
          isSkippingTurnRef.current = false;
        }, 1000);
      }
    }
  }, []); // 의존성 배열 비움 - 콜백은 ref로 관리

  return { user, setUser, gameState, players, setPlayers, isLoading };
}
