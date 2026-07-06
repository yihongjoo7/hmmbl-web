/** [퍼블리셔] 룰렛 화면 레이아웃 */
interface RouletteViewProps { isSpinning?: boolean; result?: { reward: number; label: string } | null; onSpin?: () => void; canSpin?: boolean; }
export function RouletteView({ isSpinning, result, onSpin, canSpin }: RouletteViewProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-6">
      <h1 className="text-2xl font-bold">오늘의 찬스</h1>
      <div className={`w-64 h-64 rounded-full border-8 border-blue-400 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 transition-transform ${isSpinning ? 'animate-spin' : ''}`}>
        {result ? <div className="text-center"><p className="text-3xl font-bold text-blue-700">{result.reward}P</p><p className="text-sm text-blue-500 mt-1">{result.label}</p></div> : <p className="text-gray-400">룰렛</p>}
      </div>
      {result && <p className="text-lg font-bold text-blue-600">🎉 {result.reward}P 적립!</p>}
      <button onClick={onSpin} disabled={!canSpin || isSpinning}
        className="w-full max-w-xs py-4 bg-blue-600 text-white rounded-xl font-bold text-lg disabled:opacity-50">
        {isSpinning ? '돌리는 중...' : canSpin ? '룰렛 돌리기' : '오늘 이미 참여했습니다'}
      </button>
    </div>
  );
}
