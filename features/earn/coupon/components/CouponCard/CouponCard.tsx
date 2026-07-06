/** [퍼블리셔] 쿠폰 카드 (목록용) */
interface CouponCardProps { brand: string; title: string; discount: string; expiresAt: string; isNew?: boolean; onClick?: () => void; }
export function CouponCard({ brand, title, discount, expiresAt, isNew, onClick }: CouponCardProps) {
  return (
    <div onClick={onClick} className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer hover:border-blue-300 transition-colors">
      <div className="w-12 h-12 rounded-lg bg-gray-100 shrink-0 flex items-center justify-center text-xs text-gray-400">로고</div>
      <div className="flex-1 min-w-0">
        {isNew && <span className="text-xs font-bold text-blue-600 mb-0.5 block">NEW</span>}
        <p className="text-xs text-gray-400">{brand}</p>
        <p className="font-medium text-sm truncate">{title}</p>
        <p className="text-xs text-gray-300 mt-0.5">~{expiresAt}</p>
      </div>
      <span className="text-sm font-bold text-blue-600 shrink-0">{discount}</span>
    </div>
  );
}
