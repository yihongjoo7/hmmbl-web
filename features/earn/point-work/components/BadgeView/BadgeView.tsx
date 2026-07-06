/** [퍼블리셔] 뱃지 목록·상세 */
interface Badge { id: string; title: string; imageUrl?: string; isAcquired: boolean; acquiredAt?: string; }
export function BadgeView({ badges = [], onBadgeClick }: { badges?: Badge[]; onBadgeClick?: (id: string) => void }) {
  return (
    <div className="grid grid-cols-4 gap-3 p-4">
      {badges.map(b => (
        <div key={b.id} onClick={() => onBadgeClick?.(b.id)} className={`flex flex-col items-center gap-1 cursor-pointer ${!b.isAcquired ? 'opacity-30 grayscale' : ''}`}>
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-2xl">{b.imageUrl ? <img src={b.imageUrl} alt={b.title} className="w-full h-full rounded-full object-cover" /> : '🏅'}</div>
          <p className="text-xs text-center text-gray-600 leading-tight">{b.title}</p>
        </div>
      ))}
    </div>
  );
}
