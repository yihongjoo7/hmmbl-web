/** [퍼블리셔] 포인트워크 화면 레이아웃 */
interface Dashboard { steps: number; todayPoint: number; totalPoint: number; goalSteps: number; }
export function PointWorkView({ dashboard, isLoading }: { dashboard?: Dashboard; isLoading?: boolean }) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  const d = dashboard ?? { steps: 0, todayPoint: 0, totalPoint: 0, goalSteps: 10000 };
  const pct = Math.min((d.steps / d.goalSteps) * 100, 100);
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="bg-blue-50 rounded-2xl p-6 text-center">
        <p className="text-5xl font-bold text-blue-600">{d.steps.toLocaleString()}</p>
        <p className="text-sm text-gray-500 mt-1">오늘 걸음수 / 목표 {d.goalSteps.toLocaleString()}</p>
        <div className="mt-4 bg-white rounded-full h-3"><div className="bg-blue-500 h-3 rounded-full transition-all" style={{ width: `${pct}%` }} /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-xl p-4 text-center"><p className="text-2xl font-bold text-green-600">+{d.todayPoint}P</p><p className="text-xs text-gray-500 mt-1">오늘 적립</p></div>
        <div className="bg-purple-50 rounded-xl p-4 text-center"><p className="text-2xl font-bold text-purple-600">{d.totalPoint.toLocaleString()}P</p><p className="text-xs text-gray-500 mt-1">누적 적립</p></div>
      </div>
    </div>
  );
}
