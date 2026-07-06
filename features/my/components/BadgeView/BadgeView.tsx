/** [퍼블리셔] 배지함 레이아웃 */
interface Badge { id: string; title: string; isAcquired: boolean; acquiredAt?: string; }
export function BadgeView({ badges = [], isLoading, onBadgeClick }: { badges?: Badge[]; isLoading?: boolean; onBadgeClick?: (id: string) => void }) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-xl font-bold">배지함</h1>
      <p className="text-sm text-gray-500">{badges.filter(b => b.isAcquired).length}/{badges.length} 획득</p>
      <div className="grid grid-cols-4 gap-3">
        {badges.map(b => (
          <div key={b.id} onClick={() => onBadgeClick?.(b.id)} className={`flex flex-col items-center gap-1 cursor-pointer ${!b.isAcquired ? 'opacity-30 grayscale' : ''}`}>
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-200 to-orange-300 flex items-center justify-center text-2xl">🏅</div>
            <p className="text-xs text-center text-gray-600 leading-tight">{b.title}</p>
            {b.isAcquired && b.acquiredAt && <p className="text-[10px] text-gray-400">{b.acquiredAt}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
