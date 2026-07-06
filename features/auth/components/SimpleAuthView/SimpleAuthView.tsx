/**
 * [퍼블리셔] 간편인증 화면 레이아웃
 * props → 렌더링만 담당. 비즈니스 로직 없음.
 */

interface SimpleAuthViewProps {
  onBiometric?: () => void;
  onPin?: () => void;
  onPattern?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export function SimpleAuthView({
  onBiometric,
  onPin,
  onPattern,
  isLoading = false,
  error,
}: SimpleAuthViewProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-6">
      <h1 className="text-xl font-bold">간편인증</h1>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button onClick={onBiometric} disabled={isLoading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50">
          🔒 생체인증
        </button>
        <button onClick={onPin} disabled={isLoading}
          className="w-full py-3 bg-gray-100 text-gray-800 rounded-lg font-medium disabled:opacity-50">
          🔢 PIN 인증
        </button>
        <button onClick={onPattern} disabled={isLoading}
          className="w-full py-3 bg-gray-100 text-gray-800 rounded-lg font-medium disabled:opacity-50">
          ⬡ 패턴 인증
        </button>
      </div>
    </div>
  );
}
