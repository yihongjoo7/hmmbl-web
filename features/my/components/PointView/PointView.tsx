/** [퍼블리셔] 포인트 현황 레이아웃 */
interface PointSummary { totalPoint: number; expiringPoint: number; expiringDate: string; }
export function PointView({ summary, isLoading }: { summary?: PointSummary; isLoading?: boolean }) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  const s = summary ?? { totalPoint: 0, expiringPoint: 0, expiringDate: '-' };
  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-bold">포인트 현황</h1>
      <div className="bg-blue-600 text-white rounded-2xl p-6 flex flex-col gap-2">
        <p className="text-sm opacity-80">보유 포인트</p>
        <p className="text-4xl font-bold">{s.totalPoint.toLocaleString()}<span className="text-xl ml-1">P</span></p>
      </div>
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex justify-between items-center">
        <div><p className="text-xs text-gray-500">소멸 예정 포인트</p><p className="font-bold text-orange-500">{s.expiringPoint.toLocaleString()}P</p></div>
        <p className="text-xs text-gray-400">{s.expiringDate} 소멸</p>
      </div>
    </div>
  );
}
