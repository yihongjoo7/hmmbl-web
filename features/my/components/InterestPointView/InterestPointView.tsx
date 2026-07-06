/** [퍼블리셔] 관심지점 레이아웃 */
interface InterestPoint { id: string; name: string; address: string; category: string; }
export function InterestPointView({ points = [], isLoading, onRemove }: { points?: InterestPoint[]; isLoading?: boolean; onRemove?: (id: string) => void }) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  return (
    <div className="flex flex-col gap-3 p-4">
      <h1 className="text-xl font-bold">관심지점</h1>
      {points.map(p => (
        <div key={p.id} className="flex items-center gap-3 border rounded-xl p-4">
          <div className="flex-1 min-w-0">
            <span className="text-xs text-blue-500">{p.category}</span>
            <p className="font-medium text-sm">{p.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{p.address}</p>
          </div>
          <button onClick={() => onRemove?.(p.id)} className="text-gray-400 hover:text-red-400 shrink-0 text-sm">삭제</button>
        </div>
      ))}
      {points.length === 0 && <p className="p-8 text-center text-gray-400 text-sm">등록된 관심지점이 없습니다.</p>}
    </div>
  );
}
