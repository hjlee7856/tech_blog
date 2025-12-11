import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

interface UseOnlineSnapshotUserIdsArgs {
  userId?: number;
}

interface UseOnlineSnapshotUserIdsReturn {
  onlineUserIds: number[];
}

export function useOnlineSnapshotUserIds(
  args: UseOnlineSnapshotUserIdsArgs = {},
): UseOnlineSnapshotUserIdsReturn {
  const { userId } = args;

  const { data, refetch } = useQuery({
    queryKey: ['genshin-bingo', 'online-users-snapshot'],
    queryFn: async () => {
      const response = await fetch('/api/genshin-impact-bingo/online-users');
      if (!response.ok) return [] as number[];

      const body = (await response.json()) as { onlineUserIds?: unknown };
      if (!Array.isArray(body.onlineUserIds)) return [] as number[];

      const ids = body.onlineUserIds.filter(
        (id): id is number => typeof id === 'number',
      );

      return ids;
    },
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (!userId) return;
    void refetch();
  }, [userId, refetch]);

  return { onlineUserIds: data ?? [] };
}
