/** [퍼블리셔] 구독쿠폰딜 카드 */
export function SubscriptionCouponCard({ title, brand, discountRate, monthlyFee, isSubscribed, onSubscribe }: { title: string; brand: string; discountRate: number; monthlyFee: number; isSubscribed?: boolean; onSubscribe?: () => void }) {
  return (
    <div className="border rounded-xl p-4 flex items-center justify-between gap-3">
      <div className="flex-1 min-w-0"><p className="font-medium text-sm truncate">{title}</p><p className="text-xs text-gray-400">{brand}</p><p className="text-xs text-blue-600 font-bold mt-0.5">{discountRate}% · {monthlyFee.toLocaleString()}P/월</p></div>
      {!isSubscribed ? <button onClick={onSubscribe} className="shrink-0 px-3 py-1.5 bg-blue-600 text-white rounded-full text-xs font-medium">구독</button> : <span className="text-xs text-green-600 font-medium">✓ 구독중</span>}
    </div>
  );
}
