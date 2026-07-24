'use client';
/**
 * [개발자] Login Container
 *
 * 이메일/비밀번호로 로그인하고, 성공 시 원래 요청했던 경로(redirect 쿼리) 또는
 * /main으로 이동합니다. 인증 상태는 useAuthStore.setAuth로 반영됩니다.
 */

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/features/auth/hooks/useAuthStore';
import { authApi } from '@/features/auth/services/authApi';
import { LoginView } from './LoginView';

export default function LoginPage() {
  const router      = useRouter();
  const searchParams = useSearchParams();
  const setAuth      = useAuthStore((s) => s.setAuth);

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setErrorMessage(undefined);
    try {
      const emailValue    = String(formData.get('email') ?? '');
      const passwordValue = String(formData.get('password') ?? '');
      const { accessToken, user } = await authApi.login(emailValue, passwordValue);
      setAuth(user, accessToken);
      const redirect = searchParams.get('redirect');
      router.replace(redirect && redirect.startsWith('/') ? redirect : '/main');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : '로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginView
      email={email}
      password={password}
      isLoading={isLoading}
      errorMessage={errorMessage}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
    />
  );
}
