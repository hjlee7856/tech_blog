import type { Player } from './game';

export function getIsFullBingoPlayer(player: Player): boolean {
  const validCount = player.board.filter((item) => item && item !== '').length;
  return validCount === 25 && player.score === 12;
}

export function sortPlayersByCompleteThenScore(players: Player[]): Player[] {
  return players.toSorted((a, b) => {
    const aComplete = getIsFullBingoPlayer(a);
    const bComplete = getIsFullBingoPlayer(b);

    if (aComplete && !bComplete) return -1;
    if (!aComplete && bComplete) return 1;

    return b.score - a.score;
  });
}

export function calculateRankMap(players: Player[]): Map<number, number> {
  const rankMap = new Map<number, number>();

  let currentRank = 1;
  let prevScore = -1;
  let prevComplete = false;

  for (const [index, player] of players.entries()) {
    const isComplete = getIsFullBingoPlayer(player);

    if (player.score !== prevScore || isComplete !== prevComplete)
      currentRank = index + 1;

    rankMap.set(player.id, currentRank);
    prevScore = player.score;
    prevComplete = isComplete;
  }

  return rankMap;
}

export function getRankAtIndex({
  index,
  players,
}: {
  index: number;
  players: Player[];
}): number {
  if (index <= 0) return 1;

  const prev = players[index - 1];
  const curr = players[index];
  if (!prev || !curr) return index + 1;

  const prevComplete = getIsFullBingoPlayer(prev);
  const currComplete = getIsFullBingoPlayer(curr);

  if (prevComplete === currComplete && prev.score === curr.score)
    return getRankAtIndex({ index: index - 1, players });

  return index + 1;
}
