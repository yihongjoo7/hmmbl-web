/** [퍼블리셔] 전자영수증 목록 화면 레이아웃 */
interface Receipt { id: string; storeName: string; amount: number; paidAt: string; }
export function ReceiptPageView({ receipts = [], isLoading, onItemClick }: { receipts?: Receipt[]; isLoading?: boolean; onItemClick?: (id: string) => void }) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  return (
    <div className="flex flex-col">
      <div className="px-4 py-3 border-b"><h1 className="text-xl font-bold">전자영수증</h1></div>
      {receipts.map(r => (
        <div key={r.id} onClick={() => onItemClick?.(r.id)} className="px-4 py-4 border-b cursor-pointer hover:bg-gray-50">
          <div className="flex justify-between"><p className="font-medium text-sm">{r.storeName}</p><p className="font-bold text-sm">{r.amount.toLocaleString()}원</p></div>
          <p className="text-xs text-gray-400 mt-1">{r.paidAt}</p>
        </div>
      ))}
      {receipts.length === 0 && <p className="p-8 text-center text-gray-400 text-sm">영수증이 없습니다.</p>}
    </div>
  );
}
