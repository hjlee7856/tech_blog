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

export function getProfileImagePath(englishName: string): string {
  const safeName = englishName.replaceAll(' ', '_').replaceAll('%20', '_');
  return `/genshin-impact/${safeName}_Avatar.webp`;
}

// 기본 프로필 이미지 (영어 이름)
const DEFAULT_PROFILE_NAMES = [
  'Nahida',
  'Raiden_Shogun',
  'Hu_Tao',
  'Zhongli',
  'Kaedehara_Kazuha',
  'Kamisato_Ayaka',
  'Ganyu',
  'Yelan',
  'Xiao',
  'Furina',
];

export function getRandomProfileName(): string {
  const index = Math.floor(Math.random() * DEFAULT_PROFILE_NAMES.length);
  return DEFAULT_PROFILE_NAMES[index] ?? 'Nahida';
}

const STORAGE_KEY = 'genshin-bingo-user';

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function register(
  name: string,
  password: string,
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const { data: existing } = await supabase
      .from('genshin-bingo-game-user')
      .select('id')
      .eq('name', name)
      .single();

    if (existing)
      return { success: false, error: '이미 존재하는 닉네임입니다.' };

    const hashedPassword = await hashPassword(password);

    const profileImage = getRandomProfileName();

    const { data, error } = await supabase
      .from('genshin-bingo-game-user')
      .insert({
        name,
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
  name: string,
  password: string,
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const hashedPassword = await hashPassword(password);

    const { data, error } = await supabase
      .from('genshin-bingo-game-user')
      .select(
        'id, name, password, score, order, is_admin, is_online, profile_image',
      )
      .eq('name', name)
      .single();

    if (error || !data)
      return { success: false, error: '존재하지 않는 닉네임입니다.' };
    if (data.password !== hashedPassword)
      return { success: false, error: '비밀번호가 일치하지 않습니다.' };

    // 중복 로그인 시 이전 기기에서 로그아웃 처리 (새 기기에서 로그인 허용)
    // is_online이 true여도 그냥 로그인 허용 (이전 기기는 자동 로그아웃)

    const user: User = {
      id: data.id,
      name: data.name,
      score: data.score,
      order: data.order,
      is_admin: data.is_admin,
      profile_image: data.profile_image || getRandomProfileName(),
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

    const { name, hashedPassword } = JSON.parse(stored) as {
      name: string;
      hashedPassword: string;
    };

    const { data, error } = await supabase
      .from('genshin-bingo-game-user')
      .select('id, name, password, score, order, is_admin, profile_image')
      .eq('name', name)
      .single();

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
      profile_image: data.profile_image || getRandomProfileName(),
    };
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

function saveToStorage(user: User, hashedPassword: string): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ name: user.name, hashedPassword }),
  );
}
