/** [퍼블리셔] 이용/구매 내역 레이아웃 */
interface HistoryItem { id: string; category: string; title: string; date: string; amount: number; }
export function HistoryView({ items = [], isLoading }: { items?: HistoryItem[]; isLoading?: boolean }) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  return (
    <div className="flex flex-col divide-y">
      {items.map(i => (
        <div key={i.id} className="px-4 py-4">
          <div className="flex justify-between"><p className="font-medium text-sm">{i.title}</p><p className="font-bold text-sm">{i.amount > 0 ? '+' : ''}{i.amount.toLocaleString()}P</p></div>
          <div className="flex gap-2 mt-1"><span className="text-xs text-blue-500">{i.category}</span><span className="text-xs text-gray-400">{i.date}</span></div>
        </div>
      ))}
      {items.length === 0 && <p className="p-8 text-center text-gray-400 text-sm">내역이 없습니다.</p>}
    </div>
  );
}
