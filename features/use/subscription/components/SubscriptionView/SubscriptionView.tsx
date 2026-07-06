/** [퍼블리셔] 구독쿠폰딜 화면 레이아웃 */
interface SubCoupon { id: string; title: string; brand: string; discountRate: number; monthlyFee: number; isSubscribed?: boolean; }
export function SubscriptionView({ coupons = [], isLoading, onSubscribe }: { coupons?: SubCoupon[]; isLoading?: boolean; onSubscribe?: (id: string) => void }) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-xl font-bold">구독쿠폰딜</h1>
      {coupons.map(c => (
        <div key={c.id} className="border rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0"><p className="font-medium text-sm truncate">{c.title}</p><p className="text-xs text-gray-400">{c.brand}</p><p className="text-xs text-blue-600 font-bold mt-1">{c.discountRate}% 할인 · 월 {c.monthlyFee.toLocaleString()}P</p></div>
          {!c.isSubscribed
            ? <button onClick={() => onSubscribe?.(c.id)} className="shrink-0 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium">구독</button>
            : <span className="shrink-0 text-xs text-green-600 font-medium">✓ 구독중</span>}
        </div>
      ))}
    </div>
  );
}
