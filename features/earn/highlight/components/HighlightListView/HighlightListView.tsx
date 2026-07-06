/** [퍼블리셔] 하이라이트 목록 화면 레이아웃 */
interface HL { id: string; title: string; brand: string; imageUrl?: string; reward: number; expiresAt: string; }
export function HighlightListView({ highlights = [], isLoading, onItemClick }: { highlights?: HL[]; isLoading?: boolean; onItemClick?: (id: string) => void }) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  return (
    <div className="flex flex-col gap-3 p-4">
      {highlights.map(h => (
        <div key={h.id} onClick={() => onItemClick?.(h.id)} className="flex gap-4 p-4 border rounded-xl cursor-pointer">
          <div className="w-16 h-16 rounded-lg bg-gray-100 shrink-0" />
          <div className="flex-1 min-w-0"><p className="text-xs text-gray-400">{h.brand}</p><p className="font-medium text-sm truncate">{h.title}</p><p className="text-xs text-blue-600 font-bold mt-1">+{h.reward}P</p></div>
        </div>
      ))}
    </div>
  );
}
