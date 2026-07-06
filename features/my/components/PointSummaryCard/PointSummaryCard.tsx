/** [퍼블리셔] 포인트 요약 카드 */
export function PointSummaryCard({ totalPoint, expiringPoint, expiringDate }: { totalPoint: number; expiringPoint?: number; expiringDate?: string }) {
  return (
    <div className="bg-blue-600 text-white rounded-2xl p-6 flex flex-col gap-3">
      <p className="text-sm opacity-80">보유 포인트</p>
      <p className="text-4xl font-bold">{totalPoint.toLocaleString()}<span className="text-xl ml-1">P</span></p>
      {expiringPoint !== undefined && expiringPoint > 0 && (
        <p className="text-xs opacity-70 bg-white/10 rounded-lg px-3 py-2">소멸 예정: {expiringPoint.toLocaleString()}P ({expiringDate})</p>
      )}
    </div>
  );
}
