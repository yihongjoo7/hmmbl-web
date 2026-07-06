/** [퍼블리셔] 랜덤박스 오픈 화면 */
interface RandomBoxViewProps { isOpening?: boolean; result?: { label: string; reward: number } | null; onOpen?: () => void; canOpen?: boolean; }
export function RandomBoxView({ isOpening, result, onOpen, canOpen }: RandomBoxViewProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-6">
      <h1 className="text-2xl font-bold">랜덤박스</h1>
      <div className={`w-40 h-40 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-3xl flex items-center justify-center text-6xl shadow-lg transition-transform ${isOpening ? 'animate-bounce' : 'hover:scale-105'}`}>
        {result ? '🎁' : '📦'}
      </div>
      {result && (
        <div className="text-center">
          <p className="text-xl font-bold text-orange-500">{result.label}</p>
          <p className="text-blue-600 font-bold mt-1">+{result.reward}P</p>
        </div>
      )}
      {!result && (
        <button onClick={onOpen} disabled={!canOpen || isOpening}
          className="w-full max-w-xs py-4 bg-orange-500 text-white rounded-xl font-bold text-lg disabled:opacity-50">
          {isOpening ? '열리는 중...' : canOpen ? '박스 열기' : '오늘 이미 오픈했습니다'}
        </button>
      )}
    </div>
  );
}
