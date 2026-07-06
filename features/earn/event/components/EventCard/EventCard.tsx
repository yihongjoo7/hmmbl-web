/** [퍼블리셔] 이벤트 카드 (목록용) */
interface EventCardProps { title: string; badge?: string; expiresAt?: string; isWished?: boolean; onClick?: () => void; }
export function EventCard({ title, badge, expiresAt, isWished, onClick }: EventCardProps) {
  return (
    <div onClick={onClick} className="relative border rounded-xl overflow-hidden cursor-pointer">
      <div className="w-full aspect-video bg-gray-100" />
      {badge && <span className="absolute top-2 left-2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">{badge}</span>}
      {isWished && <span className="absolute top-2 right-2 text-red-500 text-lg">♥</span>}
      <div className="p-3">
        <p className="font-medium text-sm">{title}</p>
        {expiresAt && <p className="text-xs text-gray-400 mt-0.5">~{expiresAt}</p>}
      </div>
    </div>
  );
}
