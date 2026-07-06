/** [퍼블리셔] 구매 내역 레이아웃 */
interface Purchase { id: string; title: string; category: string; price: number; purchasedAt: string; }
export function PurchaseView({ purchases = [], isLoading }: { purchases?: Purchase[]; isLoading?: boolean }) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  return (
    <div className="flex flex-col divide-y">
      {purchases.map(p => (
        <div key={p.id} className="px-4 py-4">
          <div className="flex justify-between"><p className="font-medium text-sm">{p.title}</p><p className="font-bold text-sm">{p.price.toLocaleString()}P</p></div>
          <div className="flex gap-2 mt-1"><span className="text-xs text-gray-400">{p.category}</span><span className="text-xs text-gray-300">·</span><span className="text-xs text-gray-400">{p.purchasedAt}</span></div>
        </div>
      ))}
      {purchases.length === 0 && <p className="p-8 text-center text-gray-400 text-sm">구매 내역이 없습니다.</p>}
    </div>
  );
}
