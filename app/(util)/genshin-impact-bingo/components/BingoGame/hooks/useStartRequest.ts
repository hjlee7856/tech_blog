import { useEffect, useState } from 'react';
import type { GameState, Player } from '../../../lib/game';

interface UseStartRequestProps {
  gameState: GameState | null;
  players: Player[];
  countdown: number | null;
  isCountdownStartingRef: React.MutableRefObject<boolean>;
  onStartCountdown: () => void;
}

interface UseStartRequestReturn {
  showStartRequestModal: boolean;
  startRequestRemainingTime: number | null;
}

export function useStartRequest({
  gameState,
  players,
  countdown,
  isCountdownStartingRef,
  onStartCountdown,
}: UseStartRequestProps): UseStartRequestReturn {
  const [showStartRequestModal, setShowStartRequestModal] = useState(false);
  const [startRequestRemainingTime, setStartRequestRemainingTime] = useState<
    number | null
  >(null);

  // 시작 요청 남은 시간 계산
  useEffect(() => {
    if (!gameState?.start_requested_at || !gameState.start_requested_by) {
      setStartRequestRemainingTime(null);
      return;
    }

    const calculateRemaining = () => {
      const requestedAt = new Date(gameState.start_requested_at!);
      const now = new Date();
      const elapsed = now.getTime() - requestedAt.getTime();
      const remaining = Math.max(0, 60 - Math.floor(elapsed / 1000));
      setStartRequestRemainingTime(remaining);
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 1000);

    return () => clearInterval(interval);
  }, [gameState?.start_requested_at, gameState?.start_requested_by]);

  // 게임 시작 요청이 있을 때 모달 표시
  useEffect(() => {
    if (!gameState || gameState.is_started) {
      setShowStartRequestModal(false);
      return;
    }

    setShowStartRequestModal(!!gameState.start_requested_by);
  }, [gameState]);

  // 모든 유저가 동의하면 게임 시작
  useEffect(() => {
    if (!gameState || gameState.is_started || !gameState.start_requested_by)
      return;

    const readyOnlinePlayers = players.filter(
      (p) => p.is_online && p.is_ready && p.board.length === 25,
    );
    const allAgreed = readyOnlinePlayers.every((p) =>
      gameState.start_agreed_users?.includes(p.id),
    );

    if (allAgreed && readyOnlinePlayers.length >= 2) {
      if (countdown === null && !isCountdownStartingRef.current) {
        onStartCountdown();
      }
    }
  }, [gameState, players, countdown, isCountdownStartingRef, onStartCountdown]);

  return { showStartRequestModal, startRequestRemainingTime };
}
