/**
 * [퍼블리셔] 본인인증 화면 레이아웃
 * props → 렌더링만 담당.
 */

type VerifyMethod = 'phone' | 'ipin' | 'email';

interface IdentityViewProps {
  method: VerifyMethod;
  onMethodChange: (m: VerifyMethod) => void;
  onRequest: () => void;
  onConfirm: (code: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function IdentityView({ method, onMethodChange, onRequest, isLoading, error }: IdentityViewProps) {
  return (
    <div className="flex flex-col gap-6 px-6 pt-8">
      <h1 className="text-xl font-bold">본인인증</h1>
      <div className="flex gap-2">
        {(['phone', 'ipin', 'email'] as VerifyMethod[]).map((m) => (
          <button key={m} onClick={() => onMethodChange(m)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${method === m ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
            {m === 'phone' ? '휴대폰' : m === 'ipin' ? '아이핀' : '이메일'}
          </button>
        ))}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button onClick={onRequest} disabled={isLoading}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50">
        {isLoading ? '처리 중...' : '인증 요청'}
      </button>
    </div>
  );
}
