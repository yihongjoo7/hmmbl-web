/** [퍼블리셔] 마이페이지 메인 레이아웃 */
interface User { name: string; email: string; }
export function MyView({ user }: { user?: User | null }) {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl">
        <div className="w-14 h-14 rounded-full bg-blue-200 flex items-center justify-center text-2xl">👤</div>
        <div><p className="font-bold text-lg">{user?.name ?? '게스트'}</p><p className="text-xs text-gray-500 mt-0.5">{user?.email ?? ''}</p></div>
      </div>
      {[['이용/구매 내역', '/my/history'], ['활동/참여 내역', '/my/activity'], ['포인트 현황', '/my/point'], ['MY 쿠폰', '/my/coupon'], ['찜 목록', '/my/wishlist'], ['자산 관리', '/my/asset']].map(([label, href]) => (
        <a key={href} href={href} className="flex items-center justify-between py-3 border-b"><span className="text-sm font-medium text-gray-700">{label}</span><span className="text-gray-400">›</span></a>
      ))}
    </div>
  );
}
