'use client';

import { css } from '@/styled-system/css';
import { useEffect, useState } from 'react';
import { TURN_TIMEOUT_MS } from '../../lib/game';

interface TurnTimerProps {
  turnStartedAt: string | null;
  isMyTurn: boolean;
  onTimeout: () => void;
}

export function TurnTimer({
  turnStartedAt,
  isMyTurn,
  onTimeout,
}: TurnTimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(60);

  useEffect(() => {
    if (!turnStartedAt) {
      setRemainingSeconds(60);
      return;
    }

    const updateTimer = () => {
      const startTime = new Date(turnStartedAt).getTime();
      const now = Date.now();
      const elapsed = now - startTime;
      const remaining = Math.max(
        0,
        Math.ceil((TURN_TIMEOUT_MS - elapsed) / 1000),
      );

      setRemainingSeconds(remaining);

      if (remaining === 0 && isMyTurn) {
        onTimeout();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 100);

    return () => clearInterval(interval);
  }, [turnStartedAt, isMyTurn, onTimeout]);

  const isWarning = remainingSeconds <= 10;

  return (
    <div
      className={css({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '8px 16px',
        borderRadius: '8px',
        backgroundColor: isWarning
          ? '#ED4245'
          : isMyTurn
            ? '#5865F2'
            : '#3F4147',
        color: 'white',
        fontWeight: 600,
        fontSize: '14px',
        transition: 'all 0.3s ease',
      })}
    >
      <span>⏱️</span>
      <span
        className={css({
          fontFamily: '"Courier New", monospace',
          fontSize: '16px',
        })}
      >
        {remainingSeconds}초
      </span>
    </div>
  );
}
