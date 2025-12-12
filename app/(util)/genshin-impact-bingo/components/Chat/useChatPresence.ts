'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  getPresenceChannel,
  releasePresenceChannel,
} from '../BingoGame/hooks/presenceClient';

// 채팅 입력중(typing) 상태를 Supabase Presence로 공유/구독하는 훅입니다.
// - 자기 자신은 typing 목록/텍스트에서 제외합니다.
// - 채널이 SUBSCRIBED 된 이후에만 track 합니다.

interface UseChatPresenceArgs {
  userId?: number;
  userName?: string;
}

interface UseChatPresenceReturn {
  typingUsers: Array<{ id: number; name: string }>;
  typingText: string;
  onLocalInputActivity: () => void;
}

export function useChatPresence(
  args: UseChatPresenceArgs = {},
): UseChatPresenceReturn {
  const { userId, userName } = args;

  const [typingUsers, setTypingUsers] = useState<
    Array<{ id: number; name: string }>
  >([]);

  const typingOffTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const isTypingRef = useRef(false);
  const isPresenceSubscribedRef = useRef(false);
  const presenceChannelRef = useRef<ReturnType<
    typeof getPresenceChannel
  > | null>(null);

  const typingText = useMemo(() => {
    if (!userId) return '';
    if (typingUsers.length === 0) return '';

    const typingNames = typingUsers.map((u) => u.name);
    const uniqueNames = [...new Set(typingNames)];
    const visibleNames = uniqueNames.slice(0, 3);
    const restCount = uniqueNames.length - visibleNames.length;

    const namesPart =
      restCount > 0
        ? `${visibleNames.join(', ')} 외 ${restCount}명`
        : visibleNames.join(', ');

    return `${namesPart} 입력중...`;
  }, [typingUsers, userId]);

  useEffect(() => {
    if (!userId) return;

    const channel = getPresenceChannel({ userId });
    presenceChannelRef.current = channel;
    isPresenceSubscribedRef.current = false;

    const syncTypingFromPresence = () => {
      const rawState = channel.presenceState() as unknown;
      const parsedState: Record<string, unknown> =
        typeof rawState === 'string'
          ? (JSON.parse(rawState) as Record<string, unknown>)
          : ((rawState || {}) as Record<string, unknown>);

      const allMetas = Object.values(parsedState).flatMap((bucket) =>
        Array.isArray(bucket) ? bucket : [],
      ) as Array<{ user_id?: number; user_name?: string; typing?: boolean }>;

      const nextTypingUsers = allMetas
        .filter((meta) => meta.typing)
        .map((meta) => {
          const id =
            typeof meta.user_id === 'number' ? meta.user_id : undefined;
          if (!id) return null;
          const name = meta.user_name?.trim() ? meta.user_name : `user-${id}`;
          return { id, name };
        })
        .filter((u): u is { id: number; name: string } => !!u)
        .filter((u) => u.id !== userId);

      setTypingUsers(nextTypingUsers);
    };

    const subscription = channel
      .on('presence', { event: 'sync' }, () => syncTypingFromPresence())
      .on('presence', { event: 'join' }, () => syncTypingFromPresence())
      .on('presence', { event: 'leave' }, () => syncTypingFromPresence())
      .subscribe((status) => {
        if (status !== 'SUBSCRIBED') return;

        isPresenceSubscribedRef.current = true;
        void channel.track({
          user_id: userId,
          user_name: userName ?? `user-${userId}`,
          typing: false,
          sent_at: new Date().toISOString(),
        });
        syncTypingFromPresence();
      });

    return () => {
      isPresenceSubscribedRef.current = false;
      presenceChannelRef.current = null;
      if (typingOffTimeoutRef.current)
        clearTimeout(typingOffTimeoutRef.current);
      void subscription.unsubscribe();
      releasePresenceChannel({ userId });
      setTypingUsers([]);
    };
  }, [userId, userName]);

  const setMyTyping = useCallback(
    (nextIsTyping: boolean) => {
      if (!userId) return;
      if (isTypingRef.current === nextIsTyping) return;
      if (!isPresenceSubscribedRef.current) return;

      isTypingRef.current = nextIsTyping;
      const channel =
        presenceChannelRef.current ?? getPresenceChannel({ userId });
      void channel.track({
        user_id: userId,
        user_name: userName ?? `user-${userId}`,
        typing: nextIsTyping,
        sent_at: new Date().toISOString(),
      });
    },
    [userId, userName],
  );

  const onLocalInputActivity = useCallback(() => {
    setMyTyping(true);
    if (typingOffTimeoutRef.current) clearTimeout(typingOffTimeoutRef.current);

    typingOffTimeoutRef.current = setTimeout(() => {
      setMyTyping(false);
    }, 3000);
  }, [setMyTyping]);

  return {
    typingUsers,
    typingText,
    onLocalInputActivity,
  };
}
