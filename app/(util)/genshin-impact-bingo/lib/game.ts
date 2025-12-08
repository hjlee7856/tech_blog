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
  // 게임 시작 요청 관련
  start_requested_by: number | null; // 게임 시작을 요청한 유저 ID
  start_agreed_users: number[]; // 게임 시작에 동의한 유저 ID 목록
  start_requested_at: string | null; // 시작 요청 시간
}

// 시작 요청 타임아웃 (60초)
const START_REQUEST_TIMEOUT_MS = 60_000;

export interface Player extends User {
  board: string[];
  is_ready: boolean;
  is_online: boolean;
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
      start_requested_by: null,
      start_agreed_users: [],
      start_requested_at: null,
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
    });

  if (stateError) return false;

  // 모든 플레이어 점수, 보드, 준비 상태 초기화
  const { error: playerError } = await supabase
    .from('genshin-bingo-game-user')
    .update({ score: 0, board: [], is_ready: false, order: 0 })
    .gte('id', 0);

  if (playerError) return false;

  // 채팅 메시지 초기화
  await supabase.from('genshin-bingo-chat').delete().gte('id', 0);

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

// 턴 넘기기 진행 중 플래그 (중복 호출 방지)
let isNextTurnInProgress = false;

export async function nextTurn(_totalPlayers?: number): Promise<boolean> {
  // 이미 턴 넘기기가 진행 중이면 무시
  if (isNextTurnInProgress) return false;
  isNextTurnInProgress = true;

  try {
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

    // 이미 같은 순서면 업데이트 불필요
    if (nextOrder === gameState.current_order) return true;

    const { error } = await supabase
      .from('genshin-bingo-game-state')
      .update({ current_order: nextOrder })
      .eq('id', GAME_STATE_ID);

    return !error;
  } finally {
    // 약간의 딜레이 후 플래그 해제 (다른 클라이언트의 중복 호출 방지)
    setTimeout(() => {
      isNextTurnInProgress = false;
    }, 500);
  }
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
      'id, name, score, order, board, is_admin, is_ready, is_online, last_seen, profile_image',
    )
    .order('score', { ascending: false });

  if (error) return [];
  return (data || []) as Player[];
}

// 온라인 플레이어만 조회 (순위용)
// 25칸 완성자(board_complete)가 최우선, 그 다음 score 기준
export async function getOnlinePlayersRanking(): Promise<Player[]> {
  const { data, error } = await supabase
    .from('genshin-bingo-game-user')
    .select(
      'id, name, score, order, board, is_admin, is_ready, is_online, last_seen, profile_image',
    )
    .eq('is_online', true);

  if (error) return [];

  // 25칸 완성자를 최우선으로 정렬
  const players = (data || []) as Player[];
  return players.toSorted((a, b) => {
    const aComplete = a.board.length === 25 && a.score === 12;
    const bComplete = b.board.length === 25 && b.score === 12;

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

// 25칸 완성 체크 (모든 칸이 뽑힌 이름에 포함 = 12줄 빙고)
export function checkBoardComplete(
  board: string[],
  drawnNames: string[],
): boolean {
  if (board.length !== 25) return false;
  return board.every((name) => drawnNames.includes(name));
}

// 12줄 빙고 체크 (25칸 모두 채워짐)
export function checkFullBingo(board: string[], drawnNames: string[]): boolean {
  if (board.length !== 25) return false;
  const bingoCount = countBingoLines(board, drawnNames);
  return bingoCount === 12; // 12줄 = 가로5 + 세로5 + 대각선2
}

// 모든 플레이어의 보드 완성 체크 및 게임 종료 처리
// 12줄(25칸) 먼저 채우는 사람이 승리
export async function checkGameFinish(
  drawnNames: string[],
): Promise<{ finished: boolean; winnerId?: number }> {
  const players = await getAllPlayers();

  for (const player of players) {
    if (player.board.length === 25 && player.order > 0) {
      // 12줄 빙고 체크 (25칸 모두 채워짐)
      const isFullBingo = checkFullBingo(player.board, drawnNames);
      if (isFullBingo) {
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

// 게임 시작 요청 (모든 온라인 유저의 동의 필요)
export async function requestStartGame(
  userId: number,
): Promise<{ success: boolean; error?: string }> {
  // 이미 시작 요청이 있는지 확인
  const currentState = await getGameState();
  if (currentState?.start_requested_by) {
    return { success: false, error: '이미 게임 시작 요청이 진행 중입니다.' };
  }

  const players = await getAllPlayers();
  const onlinePlayers = players.filter((p) => p.is_online);
  const readyPlayers = onlinePlayers.filter(
    (p) => p.is_ready && p.board.length === 25,
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

  // 모든 온라인 준비 유저가 동의했는지 확인
  const players = await getAllPlayers();
  const readyOnlinePlayers = players.filter(
    (p) => p.is_online && p.is_ready && p.board.length === 25,
  );
  const allAgreed = readyOnlinePlayers.every((p) =>
    newAgreedUsers.includes(p.id),
  );

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

// 하트비트 - 온라인 상태 갱신 (주기적 호출용)
export async function heartbeat(userId: number): Promise<boolean> {
  const { error } = await supabase
    .from('genshin-bingo-game-user')
    .update({ last_seen: new Date().toISOString(), is_online: true })
    .eq('id', userId);

  return !error;
}

// 오래된 오프라인 유저 체크 (last_seen이 30초 이상 지난 유저)
export async function checkAndUpdateOfflineUsers(): Promise<void> {
  const players = await getAllPlayers();
  const now = new Date();
  const OFFLINE_THRESHOLD_MS = 30_000; // 30초

  for (const player of players) {
    if (player.is_online && player.last_seen) {
      const lastSeen = new Date(player.last_seen);
      const diff = now.getTime() - lastSeen.getTime();
      if (diff > OFFLINE_THRESHOLD_MS) {
        await updateOnlineStatus(player.id, false);
      }
    }
  }
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

// 오프라인 유저를 동의 목록에서 제외하고 시작 요청 유효성 체크
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
  const readyOnlinePlayers = players.filter(
    (p) => p.is_online && p.is_ready && p.board.length === 25,
  );

  // 요청자가 오프라인이면 요청 취소
  const requester = players.find((p) => p.id === gameState.start_requested_by);
  if (!requester?.is_online) {
    await cancelStartRequest();
    return {
      valid: false,
      cancelled: true,
      reason: '요청자가 오프라인입니다.',
    };
  }

  // 준비된 온라인 유저가 2명 미만이면 요청 취소
  if (readyOnlinePlayers.length < 2) {
    await cancelStartRequest();
    return {
      valid: false,
      cancelled: true,
      reason: '준비된 유저가 부족합니다.',
    };
  }

  // 오프라인이 된 유저를 동의 목록에서 제외
  const onlineAgreedUsers = gameState.start_agreed_users.filter((userId) => {
    const player = players.find((p) => p.id === userId);
    return player?.is_online && player?.is_ready && player?.board.length === 25;
  });

  // 동의 목록이 변경되었으면 업데이트
  if (onlineAgreedUsers.length !== gameState.start_agreed_users.length) {
    await supabase
      .from('genshin-bingo-game-state')
      .update({ start_agreed_users: onlineAgreedUsers })
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

  return supabase
    .channel('chat-messages')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'genshin-bingo-chat' },
      (payload) => {
        onNewMessage(payload.new as ChatMessage);
      },
    )
    .subscribe();
}
