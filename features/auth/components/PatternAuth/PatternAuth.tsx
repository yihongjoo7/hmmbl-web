/**
 * [퍼블리셔] 패턴 인증 그리드 (3×3)
 */

interface PatternAuthProps {
  pattern: number[];
  onPointSelect: (point: number) => void;
  onSubmit: () => void;
  onReset: () => void;
  error?: string | null;
  isLoading?: boolean;
}

export function PatternAuth({
  pattern, onPointSelect, onSubmit, onReset, error, isLoading,
}: PatternAuthProps) {
  return (
    <div className="flex flex-col items-center gap-8 px-6 pt-8">
      <h1 className="text-xl font-bold">패턴 인증</h1>
      <div className="grid grid-cols-3 gap-6">
        {Array.from({ length: 9 }, (_, i) => i + 1).map(point => (
          <button key={point} onClick={() => onPointSelect(point)}
            disabled={pattern.includes(point) || isLoading}
            className={`w-14 h-14 rounded-full border-2 transition-colors ${
              pattern.includes(point) ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300 hover:border-blue-400'
            } disabled:cursor-default`} />
        ))}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex gap-4">
        <button onClick={onReset} className="px-6 py-2 border rounded-lg text-sm text-gray-600">초기화</button>
        <button onClick={onSubmit} disabled={pattern.length < 4 || isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50">
          {isLoading ? '확인 중...' : '확인'}
        </button>
      </div>
    </div>
  );
}
