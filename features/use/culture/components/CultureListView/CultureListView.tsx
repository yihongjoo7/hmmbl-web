/** [퍼블리셔] 컬처 목록 화면 레이아웃 */
interface CultureItem { id: string; title: string; category: string; price: number; point: number; }
export function CultureListView({ items = [], isLoading, onItemClick }: { items?: CultureItem[]; isLoading?: boolean; onItemClick?: (id: string) => void }) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {items.map(i => (
        <div key={i.id} onClick={() => onItemClick?.(i.id)} className="border rounded-xl overflow-hidden cursor-pointer">
          <div className="w-full aspect-square bg-gray-100" />
          <div className="p-3"><span className="text-xs text-blue-500">{i.category}</span><p className="font-medium text-sm mt-0.5 truncate">{i.title}</p><p className="text-xs text-blue-600 font-bold mt-1">{i.point.toLocaleString()}P</p></div>
        </div>
      ))}
    </div>
  );
}
