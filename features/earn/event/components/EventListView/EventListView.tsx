/** [퍼블리셔] 이벤트 목록 화면 레이아웃 */
interface Event { id: string; title: string; badge?: string; expiresAt?: string; }
export function EventListView({ events = [], isLoading, onEventClick }: { events?: Event[]; isLoading?: boolean; onEventClick?: (id: string) => void }) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  return (
    <div className="flex flex-col gap-3 p-4">
      {events.map(e => (
        <div key={e.id} onClick={() => onEventClick?.(e.id)} className="relative border rounded-xl overflow-hidden cursor-pointer">
          <div className="w-full aspect-video bg-gray-100" />
          {e.badge && <span className="absolute top-2 left-2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">{e.badge}</span>}
          <div className="p-3"><p className="font-medium text-sm">{e.title}</p>{e.expiresAt && <p className="text-xs text-gray-400 mt-0.5">~{e.expiresAt}</p>}</div>
        </div>
      ))}
    </div>
  );
}
