/** [퍼블리셔] 찜 목록 레이아웃 */
interface WishItem { id: string; title: string; type: 'event' | 'coupon'; imageUrl?: string; }
export function WishlistView({ items = [], isLoading, onItemClick, onRemove }: { items?: WishItem[]; isLoading?: boolean; onItemClick?: (id: string) => void; onRemove?: (id: string) => void }) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  return (
    <div className="flex flex-col gap-3 p-4">
      <h1 className="text-xl font-bold">찜 목록</h1>
      {items.map(i => (
        <div key={i.id} className="flex items-center gap-4 border rounded-xl p-3">
          <div className="w-12 h-12 rounded-lg bg-gray-100 shrink-0" />
          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onItemClick?.(i.id)}>
            <span className="text-xs text-blue-500">{i.type === 'event' ? '이벤트' : '쿠폰'}</span>
            <p className="font-medium text-sm truncate">{i.title}</p>
          </div>
          <button onClick={() => onRemove?.(i.id)} className="text-red-400 text-lg shrink-0">♥</button>
        </div>
      ))}
      {items.length === 0 && <p className="p-8 text-center text-gray-400 text-sm">찜한 항목이 없습니다.</p>}
    </div>
  );
}
