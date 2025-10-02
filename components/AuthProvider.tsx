'use client';

import Cookies from 'js-cookie';
import ky from 'ky';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { useAuthStore } from '@/store/authStore';

import LoginPage from '../pages/login';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const { isLoggedIn, isLoading, login, logout, setLoading } = useAuthStore();
  const isPreviewPath = router.pathname.startsWith('/preview');

  useEffect(() => {
    // 라우터가 준비되지 않았으면 아무것도 하지 않음
    if (!router.isReady) {
      return;
    }

    if (isPreviewPath) {
      const token = Cookies.get('token');
      if (token) {
        const fetchUser = async () => {
          try {
            const user = await ky
              .get('/api/me', {
                headers: { Authorization: `Bearer ${token}` },
              })
              .json<{ email: string }>();
            login(user);
          } catch (err) {
            console.error('Failed to fetch user', err);
            Cookies.remove('token', { path: '/' });
            logout();
            setLoading(false);
          }
        };
        void fetchUser();
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [login, logout, isPreviewPath, setLoading, router.isReady]);

  if (isPreviewPath && isLoading) {
    return null; // 로딩 중에는 아무것도 렌더링하지 않음
  }

  if (isPreviewPath && !isLoggedIn) {
    return <LoginPage>{children}</LoginPage>;
  }

  return <>{children}</>;
}
