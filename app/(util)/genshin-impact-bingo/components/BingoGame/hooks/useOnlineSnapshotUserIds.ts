import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getOnlineUserIds } from '../../../lib/online';

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
    queryFn: async () => getOnlineUserIds(),
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (!userId) return;
    void refetch();
  }, [userId, refetch]);

  return { onlineUserIds: data ?? [] };
}
