/** [퍼블리셔] Login 화면 레이아웃 — 이메일/비밀번호 로그인 폼 */

import { Input } from '@/components/common/ui/input/Input';
import { Button } from '@/components/common/ui/action/Button';

interface LoginViewProps {
  email?:         string;
  password?:      string;
  isLoading?:     boolean;
  errorMessage?:  string;
  onEmailChange?:    (value: string) => void;
  onPasswordChange?: (value: string) => void;
  /** React 19 form action — 제출 시 폼의 FormData를 받는다(preventDefault 불필요) */
  onSubmit?:         (formData: FormData) => void;
}

export function LoginView({
  email = '',
  password = '',
  isLoading = false,
  errorMessage,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginViewProps) {
  return (
    <div className="flex flex-col justify-center min-h-screen p-6">
      <form action={onSubmit} className="flex flex-col gap-4 w-full max-w-sm mx-auto">
        <h1 className="text-xl font-bold text-text-primary mb-2">로그인</h1>

        <Input
          name="email"
          type="email"
          label="이메일"
          value={email}
          onChange={(e) => onEmailChange?.(e.target.value)}
          autoComplete="email"
          required
        />

        <Input
          name="password"
          type="password"
          label="비밀번호"
          value={password}
          onChange={(e) => onPasswordChange?.(e.target.value)}
          autoComplete="current-password"
          required
        />

        {errorMessage && (
          <p className="text-sm text-error" role="alert">{errorMessage}</p>
        )}

        <Button type="submit" isLoading={isLoading} fullWidth>
          {isLoading ? '로그인 중…' : '로그인'}
        </Button>
      </form>
    </div>
  );
}
