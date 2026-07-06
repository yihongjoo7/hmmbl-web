/** [퍼블리셔] 쿠폰 상세 화면 레이아웃 */
interface CouponDetail { id: string; brand: string; title: string; discount: string; description?: string; expiresAt: string; barcode?: string; }
interface CouponDetailViewProps { coupon?: CouponDetail; isLoading?: boolean; onUse?: () => void; }
export function CouponDetailView({ coupon, isLoading, onUse }: CouponDetailViewProps) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  if (!coupon) return <div className="p-6 text-center text-gray-400">쿠폰 정보를 찾을 수 없습니다.</div>;
  return (
    <div className="flex flex-col gap-6 p-6 pb-24">
      <div className="text-center"><p className="text-gray-400 text-sm">{coupon.brand}</p><h1 className="text-2xl font-bold mt-1">{coupon.title}</h1><p className="text-blue-600 text-xl font-bold mt-2">{coupon.discount}</p></div>
      {coupon.barcode && <div className="bg-gray-100 rounded-xl p-6 flex items-center justify-center"><p className="font-mono text-lg tracking-widest">{coupon.barcode}</p></div>}
      {coupon.description && <p className="text-sm text-gray-500 leading-relaxed">{coupon.description}</p>}
      <p className="text-xs text-gray-300 text-center">유효기간: ~{coupon.expiresAt}</p>
      <button onClick={onUse} className="fixed bottom-6 left-6 right-6 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg">쿠폰 사용</button>
    </div>
  );
}
