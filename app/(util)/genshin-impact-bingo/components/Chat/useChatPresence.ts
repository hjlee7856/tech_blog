'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  getPresenceChannel,
  releasePresenceChannel,
} from '../BingoGame/hooks/presenceClient';

const TYPING_OFF_DELAY_MS = 7000;

// 채팅 입력중(typing) 상태를 Supabase Presence로 공유/구독하는 훅입니다.
// - 자기 자신은 typing 목록/텍스트에서 제외합니다.
// - 채널이 SUBSCRIBED 된 이후에만 track 합니다.

interface UseChatPresenceArgs {
  userId?: number;
  userName?: string;
  profileImage?: string;
}

interface UseChatPresenceReturn {
  typingUsers: Array<{ id: number; name: string; profileImage?: string }>;
  typingText: string;
  onLocalInputActivity: () => void;
  stopTyping: () => void;
}

export function useChatPresence(
  args: UseChatPresenceArgs = {},
): UseChatPresenceReturn {
  const { userId, userName, profileImage } = args;

  const [typingUsers, setTypingUsers] = useState<
    Array<{ id: number; name: string; profileImage?: string }>
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

    const visibleUsers = typingUsers.slice(0, 3);
    const restCount = typingUsers.length - visibleUsers.length;

    const visibleNames = visibleUsers
      .map((u) => u.name)
      .filter((name) => !!name);
    if (visibleNames.length === 0) return '';

    const visibleNamesWithNim = visibleNames.map((name) => `${name}님`);

    if (restCount > 0)
      return `${visibleNamesWithNim.join(', ')} 외 ${restCount}명이 입력 중입니다`;

    return `${visibleNamesWithNim.join(', ')}이 입력 중입니다`;
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
      ) as Array<{
        user_id?: number;
        user_name?: string;
        profile_image?: string;
        typing?: boolean;
      }>;

      const nextTypingUsers = allMetas
        .flatMap((meta) => {
          if (!meta.typing) return [];
          if (typeof meta.user_id !== 'number') return [];

          const id = meta.user_id;
          const name = meta.user_name?.trim() ? meta.user_name : `user-${id}`;
          const nextProfileImage = meta.profile_image?.trim()
            ? meta.profile_image
            : undefined;

          return [
            {
              id,
              name,
              ...(nextProfileImage ? { profileImage: nextProfileImage } : {}),
            },
          ];
        })
        .filter((u) => u.id !== userId);

      const uniqueSortedTypingUsers = Array.from(
        new Map(nextTypingUsers.map((u) => [u.id, u])).values(),
      ).toSorted((a, b) => {
        const nameCompare = a.name.localeCompare(b.name, 'ko');
        if (nameCompare !== 0) return nameCompare;
        return a.id - b.id;
      });

      setTypingUsers(uniqueSortedTypingUsers);
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
          profile_image: profileImage,
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
  }, [userId, userName, profileImage]);

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
        profile_image: profileImage,
        typing: nextIsTyping,
        sent_at: new Date().toISOString(),
      });
    },
    [userId, userName, profileImage],
  );

  const stopTyping = useCallback(() => {
    if (typingOffTimeoutRef.current) clearTimeout(typingOffTimeoutRef.current);
    typingOffTimeoutRef.current = null;
    setMyTyping(false);
  }, [setMyTyping]);

  const onLocalInputActivity = useCallback(() => {
    setMyTyping(true);
    if (typingOffTimeoutRef.current) clearTimeout(typingOffTimeoutRef.current);

    typingOffTimeoutRef.current = setTimeout(() => {
      setMyTyping(false);
    }, TYPING_OFF_DELAY_MS);
  }, [setMyTyping]);

  return {
    typingUsers,
    typingText,
    onLocalInputActivity,
    stopTyping,
  };
}
