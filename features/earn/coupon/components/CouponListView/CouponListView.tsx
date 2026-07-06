/** [퍼블리셔] 쿠폰 목록 화면 레이아웃 */
interface Filter { id: string; label: string; }
interface Coupon { id: string; brand: string; title: string; discount: string; expiresAt: string; isNew?: boolean; }
interface CouponListViewProps { coupons?: Coupon[]; filters?: Filter[]; selectedFilter?: string; onFilterChange?: (id: string) => void; onCouponClick?: (id: string) => void; isLoading?: boolean; }

export function CouponListView({ coupons = [], filters = [], selectedFilter, onFilterChange, onCouponClick, isLoading }: CouponListViewProps) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  return (
    <div className="flex flex-col">
      <div className="flex gap-2 px-4 py-3 overflow-x-auto border-b">
        {filters.map(f => (
          <button key={f.id} onClick={() => onFilterChange?.(f.id)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedFilter === f.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{f.label}</button>
        ))}
      </div>
      <ul className="flex flex-col divide-y divide-gray-100 px-4">
        {coupons.map(c => (
          <li key={c.id} onClick={() => onCouponClick?.(c.id)} className="py-4 flex items-center gap-4 cursor-pointer">
            <div className="w-14 h-14 rounded-xl bg-gray-100 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400">{c.brand}</p>
              <p className="font-medium mt-0.5 truncate">{c.title}</p>
              <p className="text-xs text-gray-300 mt-1">~{c.expiresAt}</p>
            </div>
            <span className="text-sm font-bold text-blue-600 shrink-0">{c.discount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
