/** [퍼블리셔] MY 쿠폰 레이아웃 */
interface MyCoupon { id: string; title: string; brand: string; expiresAt: string; status: 'available' | 'used' | 'expired'; }
export function MyCouponView({ coupons = [], isLoading, onCouponClick }: { coupons?: MyCoupon[]; isLoading?: boolean; onCouponClick?: (id: string) => void }) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  const available = coupons.filter(c => c.status === 'available');
  const used      = coupons.filter(c => c.status !== 'available');
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-xl font-bold">MY 쿠폰 <span className="text-blue-600 ml-1">{available.length}</span></h1>
      {available.map(c => (
        <div key={c.id} onClick={() => onCouponClick?.(c.id)} className="border rounded-xl p-4 cursor-pointer">
          <p className="text-xs text-gray-400">{c.brand}</p>
          <p className="font-medium text-sm mt-0.5">{c.title}</p>
          <p className="text-xs text-gray-300 mt-1">~{c.expiresAt}</p>
        </div>
      ))}
      {used.length > 0 && <div className="opacity-40">{used.map(c => <div key={c.id} className="border rounded-xl p-4 mt-2"><p className="text-xs text-gray-400">{c.brand}</p><p className="font-medium text-sm mt-0.5">{c.title}</p><p className="text-xs mt-1">{c.status === 'used' ? '사용완료' : '기간만료'}</p></div>)}</div>}
    </div>
  );
}
