export async function getOnlineUserIds(): Promise<number[]> {
  try {
    const res = await fetch('/api/genshin-impact-bingo/online-users');

    if (!res.ok) return [];

    const data = (await res.json()) as { onlineUserIds?: number[] };

    if (!Array.isArray(data.onlineUserIds)) return [];

    return data.onlineUserIds.filter(
      (id): id is number => typeof id === 'number',
    );
  } catch {
    return [];
  }
}
