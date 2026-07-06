/**
 * [퍼블리셔] 바이오(생체) 인증 화면
 */

interface BiometricAuthViewProps {
  onAuthenticate: () => void;
  isLoading?: boolean;
  isAuthenticated?: boolean;
  error?: string | null;
  label?: string;
}

export function BiometricAuthView({
  onAuthenticate, isLoading, isAuthenticated, error, label = '생체인증으로 로그인',
}: BiometricAuthViewProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-6">
      <div className="text-6xl">{isAuthenticated ? '✅' : '🔒'}</div>
      <h1 className="text-xl font-bold">{isAuthenticated ? '인증 완료' : label}</h1>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      {!isAuthenticated && (
        <button onClick={onAuthenticate} disabled={isLoading}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium disabled:opacity-50">
          {isLoading ? '인증 중...' : '인증하기'}
        </button>
      )}
    </div>
  );
}
