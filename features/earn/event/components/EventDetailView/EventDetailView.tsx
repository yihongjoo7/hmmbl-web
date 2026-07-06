/** [퍼블리셔] 이벤트 상세 화면 레이아웃 */
interface EventDetail { title: string; description?: string; expiresAt?: string; isParticipated?: boolean; }
export function EventDetailView({ event, isLoading, onParticipate }: { event?: EventDetail; isLoading?: boolean; onParticipate?: () => void }) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  if (!event) return null;
  return (
    <div className="flex flex-col gap-6 p-6 pb-24">
      <h1 className="text-xl font-bold">{event.title}</h1>
      {event.description && <p className="text-sm text-gray-500 leading-relaxed">{event.description}</p>}
      {event.expiresAt && <p className="text-xs text-gray-400 text-right">이벤트 기간 ~{event.expiresAt}</p>}
      {!event.isParticipated
        ? <button onClick={onParticipate} className="fixed bottom-6 left-6 right-6 py-4 bg-blue-600 text-white rounded-xl font-bold">참여하기</button>
        : <p className="text-center text-green-600 font-medium">✓ 참여 완료</p>}
    </div>
  );
}
