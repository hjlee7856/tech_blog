import sha256 from 'crypto-js/sha256';
import Cookies from 'js-cookie';
import ky from 'ky';
import { type FormEvent, useState } from 'react';

import { useAuthStore } from '../store/authStore';

interface LoginPageProps {
  children: React.ReactNode;
}

export default function LoginPage({ children }: LoginPageProps) {
  const { isLoggedIn, login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await ky
        .post('/api/login', {
          json: { email, password: sha256(password).toString() },
        })
        .json<{ user: { email: string }; token: string }>();
      Cookies.set('token', response.token, { expires: 7, path: '/' }); // path: '/' 추가
      login(response.user);
    } catch (err) {
      setError('로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해주세요.');
      console.error(err);
    }
  };

  return (
    <>
      {!isLoggedIn ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <div
            style={{
              maxWidth: '400px',
              margin: '50px auto',
              padding: '20px',
              border: '1px solid #ccc',
              borderRadius: '8px',
            }}
          >
            <h1 style={{ textAlign: 'center' }}>로그인</h1>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="email">이메일</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="password">비밀번호</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#0070f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                로그인
              </button>
            </form>
          </div>
        </div>
      ) : (
        children
      )}
    </>
  );
}
