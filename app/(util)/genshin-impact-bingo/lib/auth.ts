import { supabase } from '@/lib/supabaseClient';

export interface User {
  id: number;
  name: string;
  score: number;
  order: number;
  is_admin: boolean;
  profile_image: string;
}

// 프로필 이미지는 영어 이름으로 DB에 저장 (e.g., "Nahida")
// 실제 이미지 경로는 /genshin-impact/{englishName}_Avatar.webp

// 기본 프로필 이미지
const DEFAULT_PROFILE_NAME = 'Arama';

export function getProfileImagePath(englishName: string): string {
  const safeName = englishName.replaceAll(' ', '_').replaceAll('%20', '_');
  return `/genshin-impact/${safeName}_Avatar.webp`;
}

const STORAGE_KEY = 'genshin-bingo-user';

interface StoredUserV2 {
  userId: number;
  hashedPassword: string;
}

interface StoredUserV1 {
  name: string;
  hashedPassword: string;
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function register(
  loginId: string,
  nickname: string,
  password: string,
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const { data: existingLoginId } = await supabase
      .from('genshin-bingo-game-user')
      .select('id')
      .eq('login_id', loginId)
      .single();

    if (existingLoginId)
      return { success: false, error: '이미 존재하는 아이디입니다.' };

    const { data: existingNickname } = await supabase
      .from('genshin-bingo-game-user')
      .select('id')
      .eq('name', nickname)
      .single();

    if (existingNickname)
      return { success: false, error: '이미 존재하는 닉네임입니다.' };

    const hashedPassword = await hashPassword(password);

    const profileImage = DEFAULT_PROFILE_NAME;

    const { data, error } = await supabase
      .from('genshin-bingo-game-user')
      .insert({
        login_id: loginId,
        name: nickname,
        password: hashedPassword,
        score: 0,
        order: 0,
        is_admin: false,
        profile_image: profileImage,
      })
      .select('id, name, score, order, is_admin, profile_image')
      .single();

    if (error) return { success: false, error: error.message };

    const user = data as User;
    saveToStorage(user, hashedPassword);
    return { success: true, user };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function login(
  loginId: string,
  password: string,
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const hashedPassword = await hashPassword(password);

    const { data, error } = await supabase
      .from('genshin-bingo-game-user')
      .select('id, name, password, score, order, is_admin, profile_image')
      .eq('login_id', loginId)
      .single();

    if (error || !data)
      return { success: false, error: '존재하지 않는 아이디입니다.' };
    if (data.password !== hashedPassword)
      return { success: false, error: '비밀번호가 일치하지 않습니다.' };

    const user: User = {
      id: data.id,
      name: data.name,
      score: data.score,
      order: data.order,
      is_admin: data.is_admin,
      profile_image: data.profile_image || DEFAULT_PROFILE_NAME,
    };
    saveToStorage(user, hashedPassword);
    return { success: true, user };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function autoLogin(): Promise<{ success: boolean; user?: User }> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { success: false };

    const parsed = JSON.parse(stored) as Partial<StoredUserV2 & StoredUserV1>;
    const hashedPassword = parsed.hashedPassword;
    if (!hashedPassword) {
      localStorage.removeItem(STORAGE_KEY);
      return { success: false };
    }

    const userId =
      typeof parsed.userId === 'number' ? parsed.userId : undefined;
    const legacyName =
      typeof parsed.name === 'string' ? parsed.name : undefined;

    const query = supabase
      .from('genshin-bingo-game-user')
      .select('id, name, password, score, order, is_admin, profile_image');

    const { data, error } = userId
      ? await query.eq('id', userId).single()
      : legacyName
        ? await query.eq('name', legacyName).single()
        : { data: null, error: new Error('invalid storage') };

    if (error || !data || data.password !== hashedPassword) {
      localStorage.removeItem(STORAGE_KEY);
      return { success: false };
    }

    const user: User = {
      id: data.id,
      name: data.name,
      score: data.score,
      order: data.order,
      is_admin: data.is_admin,
      profile_image: data.profile_image || DEFAULT_PROFILE_NAME,
    };

    saveToStorage(user, hashedPassword);
    return { success: true, user };
  } catch {
    return { success: false };
  }
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export async function updateProfileImage(
  userId: number,
  profileImage: string,
): Promise<boolean> {
  const { error } = await supabase
    .from('genshin-bingo-game-user')
    .update({ profile_image: profileImage })
    .eq('id', userId);

  return !error;
}

export async function updateNickname(
  userId: number,
  newName: string,
  currentPassword: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    // 비밀번호 확인
    const hashedPassword = await hashPassword(currentPassword);
    const { data: user } = await supabase
      .from('genshin-bingo-game-user')
      .select('password, name')
      .eq('id', userId)
      .single();

    if (!user || user.password !== hashedPassword) {
      return { success: false, error: '비밀번호가 일치하지 않습니다.' };
    }

    // 중복 닉네임 확인
    const { data: existing } = await supabase
      .from('genshin-bingo-game-user')
      .select('id')
      .eq('name', newName)
      .single();

    if (existing && existing.id !== userId) {
      return { success: false, error: '이미 존재하는 닉네임입니다.' };
    }

    // 닉네임 업데이트
    const { error } = await supabase
      .from('genshin-bingo-game-user')
      .update({ name: newName })
      .eq('id', userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

function saveToStorage(user: User, hashedPassword: string): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ userId: user.id, hashedPassword }),
  );
}
