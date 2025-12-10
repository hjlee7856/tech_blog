import { useEffect, useState } from 'react';

interface UseOnlineSnapshotUserIdsReturn {
  onlineUserIds: number[];
}

export function useOnlineSnapshotUserIds(): UseOnlineSnapshotUserIdsReturn {
  const [onlineUserIds, setOnlineUserIds] = useState<number[]>([]);

  useEffect(() => {
    let cancelled = false;

    const fetchSnapshot = async () => {
      try {
        const res = await fetch('/api/genshin-impact-bingo/online-users');
        if (!res.ok) return;

        const data = (await res.json()) as { onlineUserIds?: unknown };
        if (!Array.isArray(data.onlineUserIds)) return;

        const ids = data.onlineUserIds.filter(
          (id): id is number => typeof id === 'number',
        );

        if (cancelled) return;
        setOnlineUserIds(ids);
      } catch {
        // 조회 실패 시에는 조용히 무시 (다음 폴링에서 재시도)
      }
    };

    void fetchSnapshot();

    const interval = setInterval(() => {
      void fetchSnapshot();
    }, 5000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return { onlineUserIds };
}
