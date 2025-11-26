import { supabase } from '@/lib/supabaseClient';
import type { User } from './auth';

export interface GameState {
  id: number;
  is_started: boolean;
  is_finished: boolean;
  winner_id: number | null;
  current_order: number;
  drawn_names: string[];
  created_at: string;
}

export interface Player extends User {
  board: string[];
  is_ready: boolean;
  is_online: boolean;
  last_seen: string;
}

const GAME_STATE_ID = 1;

// 빙고 라인 정의 (5x5 보드)
const BINGO_LINES = [
  // 가로
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  // 세로
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
  // 대각선
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20],
];

export async function getGameState(): Promise<GameState | null> {
  const { data, error } = await supabase
    .from('genshin-bingo-game-state')
    .select('*')
    .eq('id', GAME_STATE_ID)
    .single();

  if (error) return null;
  return data as GameState;
}

export async function startGame(forceStart = false): Promise<{
  success: boolean;
  error?: string;
}> {
  // 온라인이고 보드가 완성된 플레이어들에게 랜덤 순서 부여
  const players = await getAllPlayers();
  const eligiblePlayers = players.filter(
    (p) => p.board.length === 25 && p.is_online,
  );

  if (eligiblePlayers.length === 0) {
    return {
      success: false,
      error: '보드를 완성한 온라인 플레이어가 없습니다.',
    };
  }

  // 어드민 강제 시작이 아닌 경우에만 모든 플레이어 준비 상태 확인
  if (!forceStart) {
    const onlinePlayers = players.filter((p) => p.is_online);
    const allReady = onlinePlayers.every((p) => p.is_ready);
    if (!allReady) {
      return {
        success: false,
        error: '모든 온라인 플레이어가 준비되지 않았습니다.',
      };
    }
  }

  // 랜덤 순서 생성
  const shuffledIndices = eligiblePlayers
    .map((_, i) => i + 1)
    .toSorted(() => Math.random() - 0.5);

  // 각 플레이어에게 순서 부여
  for (const [i, player] of eligiblePlayers.entries()) {
    const order = shuffledIndices[i];
    if (player && order !== undefined) {
      await updatePlayerOrder(player.id, order);
    }
  }

  // 보드 미완성 플레이어는 순서 0으로
  const notReadyPlayers = players.filter((p) => p.board.length !== 25);
  for (const player of notReadyPlayers) {
    await updatePlayerOrder(player.id, 0);
  }

  const { error: stateError } = await supabase
    .from('genshin-bingo-game-state')
    .upsert({
      id: GAME_STATE_ID,
      is_started: true,
      is_finished: false,
      winner_id: null,
      current_order: 1,
      drawn_names: [],
    });

  if (stateError) return { success: false, error: stateError.message };

  // 게임 시작 후 준비 상태 초기화 (다음 게임을 위해)
  await supabase
    .from('genshin-bingo-game-user')
    .update({ is_ready: false })
    .gte('id', 0);

  return { success: true };
}

export async function resetGame(): Promise<boolean> {
  // 게임 상태 초기화
  const { error: stateError } = await supabase
    .from('genshin-bingo-game-state')
    .upsert({
      id: GAME_STATE_ID,
      is_started: false,
      is_finished: false,
      winner_id: null,
      current_order: 0,
      drawn_names: [],
    });

  if (stateError) return false;

  // 모든 플레이어 점수, 보드, 준비 상태 초기화
  const { error: playerError } = await supabase
    .from('genshin-bingo-game-user')
    .update({ score: 0, board: [], is_ready: false, order: 0 })
    .gte('id', 0);

  return !playerError;
}

export async function drawName(
  characterNames: string[],
  drawnNames: string[],
): Promise<{ success: boolean; name?: string; error?: string }> {
  const availableNames = characterNames.filter((n) => !drawnNames.includes(n));

  if (availableNames.length === 0) {
    return { success: false, error: '더 이상 뽑을 캐릭터가 없습니다.' };
  }

  const randomIndex = Math.floor(Math.random() * availableNames.length);
  const drawnName = availableNames[randomIndex];

  const newDrawnNames = [...drawnNames, drawnName];

  const { error } = await supabase
    .from('genshin-bingo-game-state')
    .update({ drawn_names: newDrawnNames })
    .eq('id', GAME_STATE_ID);

  if (error) return { success: false, error: error.message };

  return { success: true, name: drawnName };
}

export async function nextTurn(_totalPlayers?: number): Promise<boolean> {
  const gameState = await getGameState();
  if (!gameState) return false;

  // 온라인이고 게임에 참여 중인(order > 0) 플레이어들만 조회
  const players = await getAllPlayers();
  const onlineActivePlayers = players
    .filter((p) => p.is_online && p.order > 0)
    .toSorted((a, b) => a.order - b.order);

  if (onlineActivePlayers.length === 0) return false;

  // 현재 순서보다 큰 온라인 플레이어 찾기
  const nextPlayer = onlineActivePlayers.find(
    (p) => p.order > gameState.current_order,
  );

  // 없으면 첫 번째 온라인 플레이어로 돌아감
  const nextOrder = nextPlayer?.order ?? onlineActivePlayers[0]?.order ?? 1;

  const { error } = await supabase
    .from('genshin-bingo-game-state')
    .update({ current_order: nextOrder })
    .eq('id', GAME_STATE_ID);

  return !error;
}

// 게임 중간 참여: 새로운 플레이어에게 순서 부여
export async function joinGameInProgress(userId: number): Promise<boolean> {
  // 현재 게임에 참여 중인 플레이어들의 최대 순서 조회
  const players = await getAllPlayers();
  const maxOrder = Math.max(...players.map((p) => p.order), 0);

  // 새 플레이어에게 다음 순서 부여
  const { error } = await supabase
    .from('genshin-bingo-game-user')
    .update({ order: maxOrder + 1 })
    .eq('id', userId);

  return !error;
}

export async function getAllPlayers(): Promise<Player[]> {
  const { data, error } = await supabase
    .from('genshin-bingo-game-user')
    .select(
      'id, name, score, order, board, is_admin, is_ready, is_online, last_seen, profile_image',
    )
    .order('order', { ascending: true });

  if (error) return [];
  return (data || []) as Player[];
}

// 특정 플레이어의 보드 조회
export async function getPlayerBoard(userId: number): Promise<string[]> {
  const { data, error } = await supabase
    .from('genshin-bingo-game-user')
    .select('board')
    .eq('id', userId)
    .single();

  if (error || !data) return [];
  return (data.board || []) as string[];
}

export async function getPlayersRanking(): Promise<Player[]> {
  const { data, error } = await supabase
    .from('genshin-bingo-game-user')
    .select(
      'id, name, score, order, board, is_admin, is_ready, is_online, last_seen, profile_image',
    )
    .order('score', { ascending: false });

  if (error) return [];
  return (data || []) as Player[];
}

// 온라인 플레이어만 조회 (순위용)
export async function getOnlinePlayersRanking(): Promise<Player[]> {
  const { data, error } = await supabase
    .from('genshin-bingo-game-user')
    .select(
      'id, name, score, order, board, is_admin, is_ready, is_online, last_seen, profile_image',
    )
    .eq('is_online', true)
    .order('score', { ascending: false });

  if (error) return [];
  return (data || []) as Player[];
}

export async function deletePlayer(userId: number): Promise<boolean> {
  const { error } = await supabase
    .from('genshin-bingo-game-user')
    .delete()
    .eq('id', userId);

  return !error;
}

// 플레이어 로그오프 처리 (삭제 대신 오프라인으로 변경)
export async function setPlayerOffline(userId: number): Promise<boolean> {
  const { error } = await supabase
    .from('genshin-bingo-game-user')
    .update({
      is_online: false,
      is_ready: false,
      last_seen: new Date().toISOString(),
    })
    .eq('id', userId);

  return !error;
}

// 빙고 완성 체크 및 점수 업데이트
export function countBingoLines(board: string[], drawnNames: string[]): number {
  if (board.length !== 25) return 0;

  const matchedIndices = new Set<number>();
  for (const [idx, name] of board.entries()) {
    if (drawnNames.includes(name)) {
      matchedIndices.add(idx);
    }
  }

  let bingoCount = 0;
  for (const line of BINGO_LINES) {
    if (line.every((idx) => matchedIndices.has(idx))) {
      bingoCount++;
    }
  }

  return bingoCount;
}

export async function updatePlayerScore(
  userId: number,
  score: number,
): Promise<boolean> {
  const { error } = await supabase
    .from('genshin-bingo-game-user')
    .update({ score })
    .eq('id', userId);

  return !error;
}

export async function checkAndUpdateAllScores(
  drawnNames: string[],
): Promise<void> {
  const players = await getAllPlayers();

  for (const player of players) {
    if (player.board.length === 25) {
      const bingoCount = countBingoLines(player.board, drawnNames);
      if (bingoCount !== player.score) {
        await updatePlayerScore(player.id, bingoCount);
      }
    }
  }
}

export async function saveBoard(
  userId: number,
  board: string[],
): Promise<boolean> {
  const { error } = await supabase
    .from('genshin-bingo-game-user')
    .update({ board })
    .eq('id', userId);

  return !error;
}

export async function updatePlayerOrder(
  userId: number,
  order: number,
): Promise<boolean> {
  const { error } = await supabase
    .from('genshin-bingo-game-user')
    .update({ order })
    .eq('id', userId);

  return !error;
}

// 준비 상태 토글
export async function toggleReady(userId: number): Promise<boolean> {
  const { data: player } = await supabase
    .from('genshin-bingo-game-user')
    .select('is_ready')
    .eq('id', userId)
    .single();

  if (!player) return false;

  const { error } = await supabase
    .from('genshin-bingo-game-user')
    .update({ is_ready: !player.is_ready })
    .eq('id', userId);

  return !error;
}

// 모든 플레이어 준비 상태 초기화
export async function resetAllReadyStatus(): Promise<boolean> {
  const { error } = await supabase
    .from('genshin-bingo-game-user')
    .update({ is_ready: false })
    .gte('id', 0);

  return !error;
}

// 특정 플레이어 준비 상태 해제
export async function setReadyFalse(userId: number): Promise<boolean> {
  const { error } = await supabase
    .from('genshin-bingo-game-user')
    .update({ is_ready: false })
    .eq('id', userId);

  return !error;
}

// 온라인 상태 업데이트
export async function updateOnlineStatus(
  userId: number,
  isOnline: boolean,
): Promise<boolean> {
  const { error } = await supabase
    .from('genshin-bingo-game-user')
    .update({
      is_online: isOnline,
      last_seen: new Date().toISOString(),
    })
    .eq('id', userId);

  return !error;
}

// 게임 종료 처리
export async function finishGame(winnerId: number): Promise<boolean> {
  const { error: stateError } = await supabase
    .from('genshin-bingo-game-state')
    .update({
      is_finished: true,
      winner_id: winnerId,
    })
    .eq('id', GAME_STATE_ID);

  if (stateError) return false;

  // 모든 플레이어 준비 상태 초기화
  const { error: playerError } = await supabase
    .from('genshin-bingo-game-user')
    .update({ is_ready: false })
    .gte('id', 0);

  return !playerError;
}

// 25칸 완성 체크
export function checkBoardComplete(
  board: string[],
  drawnNames: string[],
): boolean {
  if (board.length !== 25) return false;
  return board.every((name) => drawnNames.includes(name));
}

// 모든 플레이어의 보드 완성 체크 및 게임 종료 처리
export async function checkGameFinish(
  drawnNames: string[],
): Promise<{ finished: boolean; winnerId?: number }> {
  const players = await getAllPlayers();

  for (const player of players) {
    if (player.board.length === 25 && player.order > 0) {
      const isComplete = checkBoardComplete(player.board, drawnNames);
      if (isComplete) {
        await finishGame(player.id);
        return { finished: true, winnerId: player.id };
      }
    }
  }

  return { finished: false };
}

export function subscribeToGameState(callback: (state: GameState) => void) {
  return supabase
    .channel('game-state-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'genshin-bingo-game-state' },
      (payload) => {
        callback(payload.new as GameState);
      },
    )
    .subscribe();
}

export function subscribeToPlayers(callback: (players: Player[]) => void) {
  return supabase
    .channel('players-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'genshin-bingo-game-user' },
      async () => {
        const players = await getAllPlayers();
        callback(players);
      },
    )
    .subscribe();
}

export function subscribeToPlayersRanking(
  callback: (players: Player[]) => void,
) {
  return supabase
    .channel('players-ranking-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'genshin-bingo-game-user' },
      async () => {
        const players = await getPlayersRanking();
        callback(players);
      },
    )
    .subscribe();
}

export function subscribeToOnlinePlayersRanking(
  callback: (players: Player[]) => void,
) {
  return supabase
    .channel('online-players-ranking-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'genshin-bingo-game-user' },
      async () => {
        const players = await getOnlinePlayersRanking();
        callback(players);
      },
    )
    .subscribe();
}
