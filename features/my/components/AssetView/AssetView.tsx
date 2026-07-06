/** [퍼블리셔] 자산 관리 레이아웃 */
interface Asset { totalPoint: number; cashBalance: number; chargeHistory?: { date: string; amount: number }[] }
export function AssetView({ asset, isLoading }: { asset?: Asset; isLoading?: boolean }) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  const a = asset ?? { totalPoint: 0, cashBalance: 0 };
  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-bold">자산 관리</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-2xl p-5 text-center"><p className="text-xs text-gray-500 mb-1">보유 포인트</p><p className="text-2xl font-bold text-blue-600">{a.totalPoint.toLocaleString()}P</p></div>
        <div className="bg-green-50 rounded-2xl p-5 text-center"><p className="text-xs text-gray-500 mb-1">충전 잔액</p><p className="text-2xl font-bold text-green-600">{a.cashBalance.toLocaleString()}원</p></div>
      </div>
    </div>
  );
}
