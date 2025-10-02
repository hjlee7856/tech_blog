import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  isLoading: boolean; // 로딩 상태 추가
  user: { email: string } | null;
  login: (user: { email: string }) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void; // 로딩 상태 설정 함수 추가
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  isLoading: true, // 초기 상태를 로딩 중으로 설정
  user: null,
  login: (user) => set({ isLoggedIn: true, user, isLoading: false }),
  logout: () => set({ isLoggedIn: false, user: null, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
