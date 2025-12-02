import { useCallback, useEffect, useRef, useState } from 'react';
import { resetGame, startGame } from '../../../lib/game';

interface UseCountdownReturn {
  countdown: number | null;
  countdownType: 'start' | 'reset' | null;
  isCountdownStartingRef: React.MutableRefObject<boolean>;
  setCountdown: React.Dispatch<React.SetStateAction<number | null>>;
  setCountdownType: React.Dispatch<
    React.SetStateAction<'start' | 'reset' | null>
  >;
  startCountdown: (type: 'start' | 'reset', seconds: number) => void;
}

export function useCountdown(onResetComplete?: () => void): UseCountdownReturn {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [countdownType, setCountdownType] = useState<'start' | 'reset' | null>(
    null,
  );
  const isCountdownStartingRef = useRef(false);

  // 콜백을 ref로 저장하여 의존성 배열에서 제거
  const onResetCompleteRef = useRef(onResetComplete);
  useEffect(() => {
    onResetCompleteRef.current = onResetComplete;
  }, [onResetComplete]);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      if (countdownType === 'start') {
        void startGame();
      } else if (countdownType === 'reset') {
        void resetGame();
        onResetCompleteRef.current?.();
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

  const startCountdown = useCallback(
    (type: 'start' | 'reset', seconds: number) => {
      if (!isCountdownStartingRef.current) {
        isCountdownStartingRef.current = true;
        setCountdownType(type);
        setCountdown(seconds);
      }
    },
    [],
  );

  return {
    countdown,
    countdownType,
    isCountdownStartingRef,
    setCountdown,
    setCountdownType,
    startCountdown,
  };
}
