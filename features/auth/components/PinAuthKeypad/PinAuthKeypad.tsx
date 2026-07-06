/**
 * [퍼블리셔] PIN 인증 키패드
 */

interface PinAuthKeypadProps {
  pinLength?: number;
  currentLength: number;
  onPinInput: (digit: string) => void;
  onDelete: () => void;
  error?: string | null;
  isLoading?: boolean;
}

const DIGITS = ['1','2','3','4','5','6','7','8','9','','0','⌫'];

export function PinAuthKeypad({
  pinLength = 6, currentLength, onPinInput, onDelete, error, isLoading,
}: PinAuthKeypadProps) {
  return (
    <div className="flex flex-col items-center gap-8 px-6 pt-8">
      <h1 className="text-xl font-bold">PIN 입력</h1>
      <div className="flex gap-3">
        {Array.from({ length: pinLength }).map((_, i) => (
          <div key={i} className={`w-4 h-4 rounded-full border-2 ${i < currentLength ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`} />
        ))}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
        {DIGITS.map((d, i) => (
          <button key={i} disabled={isLoading || d === ''}
            onClick={() => d === '⌫' ? onDelete() : d ? onPinInput(d) : undefined}
            className={`h-16 rounded-2xl text-xl font-medium transition-colors ${
              d === '' ? '' : d === '⌫' ? 'bg-gray-100 text-gray-600' : 'bg-gray-50 text-gray-900 hover:bg-gray-100 active:bg-gray-200'
            } disabled:opacity-50`}>
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}
