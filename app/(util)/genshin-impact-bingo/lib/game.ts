import { supabase } from '@/lib/supabaseClient';
import type { User } from './auth';
import { getOnlineUserIds } from './online';

export interface GameState {
  id: number;
  is_started: boolean;
  is_finished: boolean;
  winner_id: number | null;
  current_order: number;
  drawn_names: string[];
  created_at: string;
  // 게임 시작 요청 관련
  start_requested_by: number | null; // 게임 시작을 요청한 유저 ID
  start_agreed_users: number[]; // 게임 시작에 동의한 유저 ID 목록
  start_requested_at: string | null; // 시작 요청 시간
  // 턴 제한시간 관련
  turn_started_at: string | null; // 현재 턴 시작 시간
}

// 시작 요청 타임아웃 (60초)
const START_REQUEST_TIMEOUT_MS = 60_000;

// 턴 제한시간 (60초)
export const TURN_TIMEOUT_MS = 60_000;

export interface Player extends User {
  board: string[];
  is_ready: boolean;
  last_seen: string;
  bingo_message: string | null;
  bingo_message_at: string | null;
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
  // 준비 완료이고 보드가 완성된 플레이어들에게 랜덤 순서 부여
  const players = await getAllPlayers();
  const eligiblePlayers = players.filter(
    (p) =>
      p.board.filter((item) => item !== null && item !== '').length === 25 &&
      p.is_ready,
  );

  if (eligiblePlayers.length === 0) {
    return {
      success: false,
      error: '보드를 완성하고 준비한 플레이어가 없습니다.',
    };
  }

  // 어드민 강제 시작이 아닌 경우에만 최소 2명 이상 확인
  if (!forceStart && eligiblePlayers.length < 2) {
    return {
      success: false,
      error: '최소 2명 이상의 플레이어가 준비되어야 합니다.',
    };
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

  // 게임에 참여하지 않는 플레이어(보드 미완성 또는 준비 상태가 아님)는 순서 0으로 초기화
  const notEligiblePlayers = players.filter((p) => {
    const filledCount = p.board.filter((item) => item && item !== '').length;
    const isBoardComplete = filledCount === 25;
    const isEligible = isBoardComplete && p.is_ready;
    return !isEligible;
  });

  for (const player of notEligiblePlayers) {
    await updatePlayerOrder(player.id, 0);
  }

  // 첫 번째 턴은 가장 작은 order를 가진 플레이어
  const firstOrder = Math.min(...shuffledIndices);

  const { error: stateError } = await supabase
    .from('genshin-bingo-game-state')
    .upsert({
      id: GAME_STATE_ID,
      is_started: true,
      is_finished: false,
      winner_id: null,
      current_order: firstOrder,
      drawn_names: [],
      start_requested_by: null,
      start_agreed_users: [],
      start_requested_at: null,
      turn_started_at: new Date().toISOString(),
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
      start_requested_by: null,
      start_agreed_users: [],
      start_requested_at: null,
      turn_started_at: null,
    });

  if (stateError) return false;

  // 모든 플레이어 점수, 보드, 준비 상태 초기화
  const { error: playerError } = await supabase
    .from('genshin-bingo-game-user')
    .update({ score: 0, board: [], is_ready: false, order: 0 })
    .gte('id', 0);

  if (playerError) return false;

  return true;
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

  const [players, onlineUserIds] = await Promise.all([
    getAllPlayers(),
    getOnlineUserIds(),
  ]);

  // 게임에 참여 중인(order > 0) 온라인 플레이어들만 조회 (presence/상위 레이어 기반)
  const activePlayers = players
    .filter((p) => p.order > 0 && onlineUserIds.includes(p.id))
    .toSorted((a, b) => a.order - b.order);

  if (activePlayers.length === 0) {
    // 온라인 플레이어가 없으면 게임 종료
    await supabase
      .from('genshin-bingo-game-state')
      .update({ is_finished: true })
      .eq('id', GAME_STATE_ID);
    return false;
  }

  // 현재 플레이어의 인덱스 찾기
  const currentIndex = activePlayers.findIndex(
    (p) => p.order === gameState.current_order,
  );

  // 다음 플레이어 인덱스 계산 (순환)
  const nextIndex = (currentIndex + 1) % activePlayers.length;
  const nextOrder =
    activePlayers[nextIndex]?.order ?? activePlayers[0]?.order ?? 1;

  const { error } = await supabase
    .from('genshin-bingo-game-state')
    .update({
      current_order: nextOrder,
      turn_started_at: new Date().toISOString(),
    })
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
      'id, name, score, order, board, is_admin, is_ready, last_seen, bingo_message, bingo_message_at, profile_image',
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

// 플레이어 보드 변경 구독
export function subscribeToPlayerBoard(
  userId: number,
  callback: (board: string[]) => void,
) {
  return supabase
    .channel(`player-board-${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'genshin-bingo-game-user',
        filter: `id=eq.${userId}`,
      },
      (payload) => {
        const newBoard = (payload.new as { board?: string[] }).board || [];
        callback(newBoard);
      },
    )
    .subscribe();
}

export async function getPlayersRanking(): Promise<Player[]> {
  const { data, error } = await supabase
    .from('genshin-bingo-game-user')
    .select(
      'id, name, score, order, board, is_admin, is_ready, last_seen, bingo_message, bingo_message_at, profile_image',
    )
    .order('score', { ascending: false });

  if (error) return [];
  return (data || []) as Player[];
}

// 게임 참여 플레이어 순위 조회
// 게임 시작 전: 온라인 플레이어만 표시 (is_online이 null이면 온라인으로 간주)
// 게임 시작 후/종료 후: order > 0인 온라인 플레이어만 표시
// 25칸 완성자(12줄 빙고)가 최우선, 그 다음 score 기준
export async function getOnlinePlayersRanking(): Promise<Player[]> {
  const gameState = await getGameState();

  const [{ data, error }, onlineUserIds] = await Promise.all([
    supabase
      .from('genshin-bingo-game-user')
      .select(
        'id, name, score, order, board, is_admin, is_ready, last_seen, bingo_message, bingo_message_at, profile_image',
      ),
    getOnlineUserIds(),
  ]);

  if (error) return [];

  // presence/상위 레이어에서 제공하는 온라인 유저 목록을 기준으로 필터링
  let filteredPlayers = (data || []) as Player[];

  filteredPlayers = filteredPlayers.filter((p) => onlineUserIds.includes(p.id));

  // 게임 시작 후 또는 종료 후에는 order > 0인 플레이어만
  if (gameState?.is_started || gameState?.is_finished) {
    filteredPlayers = filteredPlayers.filter((p) => p.order > 0);
  }

  // 25칸 완성자를 최우선으로 정렬
  return filteredPlayers.toSorted((a, b) => {
    // 실제 캐릭터 수 확인
    const aValidBoard = a.board.filter((item) => item && item !== '');
    const bValidBoard = b.board.filter((item) => item && item !== '');

    const aComplete = aValidBoard.length === 25 && a.score === 12;
    const bComplete = bValidBoard.length === 25 && b.score === 12;

    // 25칸 완성자(12줄)가 최우선
    if (aComplete && !bComplete) return -1;
    if (!aComplete && bComplete) return 1;

    // 그 외에는 score 기준
    return b.score - a.score;
  });
}

export async function deletePlayer(userId: number): Promise<boolean> {
  const { error } = await supabase
    .from('genshin-bingo-game-user')
    .delete()
    .eq('id', userId);

  return !error;
}

// 플레이어 로그오프 처리 (준비 상태만 해제)
export async function setPlayerOffline(userId: number): Promise<boolean> {
  const { error } = await supabase
    .from('genshin-bingo-game-user')
    .update({
      is_ready: false,
    })
    .eq('id', userId);

  return !error;
}

// 빙고 완성 체크 및 점수 업데이트
export function countBingoLines(board: string[], drawnNames: string[]): number {
  if (board.length !== 25) return 0;

  const matchedIndices = new Set<number>();
  for (const [idx, name] of board.entries()) {
    // null, undefined, 빈 문자열 체크
    if (name && drawnNames.includes(name)) {
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

  // 게임 참여 중인 플레이어만 점수 업데이트 (order > 0)
  const activePlayers = players.filter((p) => p.order > 0);

  for (const player of activePlayers) {
    const validBoard = player.board.filter((item) => item && item !== '');
    if (validBoard.length === 25) {
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

  const newReadyState = !player.is_ready;

  const { error } = await supabase
    .from('genshin-bingo-game-user')
    .update({ is_ready: newReadyState })
    .eq('id', userId);

  if (error) return false;

  // 준비 취소 시 시작 요청 동의 목록에서도 제거
  if (!newReadyState) {
    const gameState = await getGameState();
    if (gameState?.start_agreed_users?.includes(userId)) {
      const newAgreedUsers = gameState.start_agreed_users.filter(
        (id) => id !== userId,
      );
      await supabase
        .from('genshin-bingo-game-state')
        .update({ start_agreed_users: newAgreedUsers })
        .eq('id', GAME_STATE_ID);
    }
  }

  return true;
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
      last_seen: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) return false;

  // 오프라인으로 전환될 때 현재 턴/순서에서 제거 (presence 기반 트리거)
  if (!isOnline) {
    const gameState = await getGameState();
    if (gameState?.is_started && !gameState.is_finished) {
      const players = await getAllPlayers();
      const player = players.find((p) => p.id === userId);

      if (player && player.order > 0) {
        const wasCurrentTurn = player.order === gameState.current_order;
        // 게임 진행 중 나간 경우 순서 제거
        await updatePlayerOrder(userId, 0);

        // 현재 턴 플레이어였다면 다음 턴으로 넘김
        if (wasCurrentTurn) await nextTurn();
      }
    }
  }

  return true;
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

// 25칸 완성 체크 (모든 칸이 뽑힌 이름에 포함 = 12줄 빙고)
export function checkBoardComplete(
  board: string[],
  drawnNames: string[],
): boolean {
  if (board.length !== 25) return false;
  return board.every((name) => drawnNames.includes(name));
}

// 12줄 빙고 체크 (25칸 모두 뽑혔는지 확인)
export function checkFullBingo(board: string[], drawnNames: string[]): boolean {
  // 보드의 실제 캐릭터 수 확인
  const validBoard = board.filter((item) => item && item !== '');
  if (validBoard.length !== 25) return false;

  // 12줄 빙고 확인 (가로5 + 세로5 + 대각선2 = 12줄)
  const bingoCount = countBingoLines(board, drawnNames);
  return bingoCount === 12;
}

// 모든 플레이어의 보드 완성 체크 및 게임 종료 처리
// 12줄 빙고를 완성한 사람이 먼저 나오면 즉시 승리
// 동시에 완성한 경우 공동 1등 처리
export async function checkGameFinish(
  drawnNames: string[],
): Promise<{ finished: boolean; winnerId?: number }> {
  const players = await getAllPlayers();

  // 게임 참여 중인 플레이어만 체크 (order > 0)
  const activePlayers = players.filter((p) => p.order > 0);

  // 12줄 빙고를 완성한 모든 플레이어 찾기
  const winners: number[] = [];

  for (const player of activePlayers) {
    // 보드의 실제 캐릭터 수 확인
    const validBoard = player.board.filter((item) => item && item !== '');

    // 25칸이 모두 채워져 있는지 확인
    if (validBoard.length === 25) {
      // 12줄 빙고 완성 체크
      const isFullBingo = checkFullBingo(player.board, drawnNames);
      if (isFullBingo) {
        winners.push(player.id);
      }
    }
  }

  // 승자가 있으면 게임 종료
  if (winners.length > 0) {
    // 첫 번째 승자를 대표로 게임 종료 (공동 1등인 경우에도 동일)
    const winnerId = winners[0];
    if (winnerId !== undefined) {
      await finishGame(winnerId);
      return { finished: true, winnerId };
    }
  }

  return { finished: false };
}

export function subscribeToGameState(callback: (state: GameState) => void) {
  const channelName = `game-state-${Math.random().toString(36).slice(7)}`;
  return supabase
    .channel(channelName)
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
  const channelName = `players-${Math.random().toString(36).slice(7)}`;
  return supabase
    .channel(channelName)
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
  const channelName = `players-ranking-${Math.random().toString(36).slice(7)}`;
  return supabase
    .channel(channelName)
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
  const channelName = `online-ranking-${Math.random().toString(36).slice(7)}`;
  return supabase
    .channel(channelName)
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

// 게임 시작 요청 (모든 준비 완료 유저의 동의 필요)
export async function requestStartGame(
  userId: number,
): Promise<{ success: boolean; error?: string }> {
  // 이미 시작 요청이 있는지 확인
  const currentState = await getGameState();
  if (currentState?.start_requested_by) {
    return { success: false, error: '이미 게임 시작 요청이 진행 중입니다.' };
  }

  const players = await getAllPlayers();
  const readyPlayers = players.filter(
    (p) =>
      p.is_ready &&
      p.board.filter((item) => item !== null && item !== '').length === 25,
  );

  if (readyPlayers.length < 2) {
    return { success: false, error: '최소 2명 이상이 준비되어야 합니다.' };
  }

  // 요청자가 준비 상태인지 확인
  const requester = readyPlayers.find((p) => p.id === userId);
  if (!requester) {
    return {
      success: false,
      error: '게임 시작을 요청하려면 준비 상태여야 합니다.',
    };
  }

  const { error } = await supabase
    .from('genshin-bingo-game-state')
    .update({
      start_requested_by: userId,
      start_agreed_users: [userId], // 요청자는 자동 동의
      start_requested_at: new Date().toISOString(), // 요청 시간 기록
    })
    .eq('id', GAME_STATE_ID);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// 게임 시작 동의
export async function agreeToStartGame(
  userId: number,
): Promise<{ success: boolean; allAgreed?: boolean; error?: string }> {
  const gameState = await getGameState();
  if (!gameState || !gameState.start_requested_by) {
    return { success: false, error: '게임 시작 요청이 없습니다.' };
  }

  // 이미 동의했는지 확인
  if (gameState.start_agreed_users.includes(userId)) {
    return { success: true, allAgreed: false };
  }

  const newAgreedUsers = [...gameState.start_agreed_users, userId];

  const { error } = await supabase
    .from('genshin-bingo-game-state')
    .update({ start_agreed_users: newAgreedUsers })
    .eq('id', GAME_STATE_ID);

  if (error) return { success: false, error: error.message };

  // 모든 준비 완료 유저가 동의했는지 확인
  const players = await getAllPlayers();
  const readyPlayers = players.filter(
    (p) =>
      p.is_ready &&
      p.board.filter((item) => item !== null && item !== '').length === 25,
  );
  const allAgreed = readyPlayers.every((p) => newAgreedUsers.includes(p.id));

  return { success: true, allAgreed };
}

// 게임 시작 요청 취소
export async function cancelStartRequest(): Promise<boolean> {
  const { error } = await supabase
    .from('genshin-bingo-game-state')
    .update({
      start_requested_by: null,
      start_agreed_users: [],
      start_requested_at: null,
    })
    .eq('id', GAME_STATE_ID);

  return !error;
}

// 시작 요청 타임아웃 체크 및 자동 취소
export async function checkStartRequestTimeout(): Promise<boolean> {
  const gameState = await getGameState();
  if (!gameState?.start_requested_by || !gameState.start_requested_at) {
    return false;
  }

  const requestedAt = new Date(gameState.start_requested_at);
  const now = new Date();
  const diff = now.getTime() - requestedAt.getTime();

  if (diff > START_REQUEST_TIMEOUT_MS) {
    await cancelStartRequest();
    return true; // 타임아웃으로 취소됨
  }

  return false;
}

// 준비 취소한 유저를 동의 목록에서 제외하고 시작 요청 유효성 체크
export async function validateStartRequest(): Promise<{
  valid: boolean;
  cancelled: boolean;
  reason?: string;
}> {
  const gameState = await getGameState();
  if (!gameState?.start_requested_by) {
    return { valid: false, cancelled: false, reason: '시작 요청이 없습니다.' };
  }

  const players = await getAllPlayers();
  const readyPlayers = players.filter(
    (p) =>
      p.is_ready &&
      p.board.filter((item) => item !== null && item !== '').length === 25,
  );

  // 요청자가 준비 취소했으면 요청 취소
  const requester = players.find((p) => p.id === gameState.start_requested_by);
  if (!requester?.is_ready) {
    await cancelStartRequest();
    return {
      valid: false,
      cancelled: true,
      reason: '요청자가 준비를 취소했습니다.',
    };
  }

  // 준비된 유저가 2명 미만이면 요청 취소
  if (readyPlayers.length < 2) {
    await cancelStartRequest();
    return {
      valid: false,
      cancelled: true,
      reason: '준비된 유저가 부족합니다.',
    };
  }

  // 준비 취소한 유저를 동의 목록에서 제외
  const validAgreedUsers = gameState.start_agreed_users.filter((userId) => {
    const player = players.find((p) => p.id === userId);
    return (
      player?.is_ready &&
      player?.board.filter((item) => item !== null && item !== '').length === 25
    );
  });

  // 동의 목록이 변경되었으면 업데이트
  if (validAgreedUsers.length !== gameState.start_agreed_users.length) {
    await supabase
      .from('genshin-bingo-game-state')
      .update({ start_agreed_users: validAgreedUsers })
      .eq('id', GAME_STATE_ID);
  }

  return { valid: true, cancelled: false };
}

// 빙고 자랑 메시지 전송
export async function sendBingoMessage(
  userId: number,
  message: string,
): Promise<boolean> {
  const { error } = await supabase
    .from('genshin-bingo-game-user')
    .update({
      bingo_message: message,
      bingo_message_at: new Date().toISOString(),
    })
    .eq('id', userId);

  return !error;
}

// 빙고 메시지 초기화
export async function clearBingoMessage(userId: number): Promise<boolean> {
  const { error } = await supabase
    .from('genshin-bingo-game-user')
    .update({
      bingo_message: null,
      bingo_message_at: null,
    })
    .eq('id', userId);

  return !error;
}

// 채팅 메시지 인터페이스
export interface ChatMessage {
  id: number;
  user_id: number;
  user_name: string;
  profile_image: string;
  message: string;
  is_boast: boolean;
  rank?: number;
  created_at: string;
}

// 채팅 메시지 전송
export async function sendChatMessage(
  userId: number,
  userName: string,
  profileImage: string,
  message: string,
  isBoast = false,
  rank?: number,
): Promise<boolean> {
  const { error } = await supabase.from('genshin-bingo-chat').insert({
    user_id: userId,
    user_name: userName,
    profile_image: profileImage,
    message,
    is_boast: isBoast,
    rank: rank ?? null,
  });

  return !error;
}

// 채팅 메시지 조회 (최근 50개)
export async function getChatMessages(): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('genshin-bingo-chat')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) return [];
  return (data as ChatMessage[]).toReversed();
}

// 채팅 메시지 실시간 구독 (초기 로드 후 새 메시지만 추가)
export function subscribeToChatMessages(
  onInitialLoad: (messages: ChatMessage[]) => void,
  onNewMessage: (message: ChatMessage) => void,
) {
  // 초기 로드
  void getChatMessages().then(onInitialLoad);

  const channelName = `chat-${Math.random().toString(36).slice(7)}`;
  return supabase
    .channel(channelName)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'genshin-bingo-chat' },
      (payload) => {
        onNewMessage(payload.new as ChatMessage);
      },
    )
    .subscribe();
}
