'use client';

import { useState } from 'react';
import { login, register, type User } from '../../lib/auth';
import {
  Backdrop,
  ErrorMessage,
  Form,
  Input,
  InputGroup,
  Label,
  Modal,
  SubmitButton,
  Title,
  ToggleButton,
} from './LoginModal.styles';

interface LoginModalProps {
  onLogin: (user: User) => void;
}

export function LoginModal({ onLogin }: LoginModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !password.trim()) {
      setError('닉네임과 비밀번호를 입력해주세요.');
      return;
    }

    if (isRegister && password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);

    const result = isRegister
      ? await register(name.trim(), password)
      : await login(name.trim(), password);

    setIsLoading(false);

    if (result.success && result.user) {
      onLogin(result.user);
    } else {
      setError(result.error || '오류가 발생했습니다.');
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError('');
    setConfirmPassword('');
  };

  return (
    <Backdrop>
      <Modal>
        <Title>{isRegister ? '회원가입' : '로그인'}</Title>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>닉네임</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="닉네임을 입력하세요"
              maxLength={20}
            />
          </InputGroup>

          <InputGroup>
            <Label>비밀번호</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
            />
          </InputGroup>

          {isRegister && (
            <InputGroup>
              <Label>비밀번호 확인</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호를 다시 입력하세요"
              />
            </InputGroup>
          )}

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? '처리 중...' : isRegister ? '가입하기' : '로그인'}
          </SubmitButton>
        </Form>

        <ToggleButton type="button" onClick={toggleMode}>
          {isRegister
            ? '이미 계정이 있으신가요? 로그인'
            : '계정이 없으신가요? 회원가입'}
        </ToggleButton>
      </Modal>
    </Backdrop>
  );
}
