/** [퍼블리셔] 활동/참여 내역 레이아웃 */
interface ActivityItem { id: string; type: string; title: string; date: string; reward?: number; }
export function ActivityView({ items = [], isLoading }: { items?: ActivityItem[]; isLoading?: boolean }) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  return (
    <div className="flex flex-col divide-y">
      {items.map(i => (
        <div key={i.id} className="px-4 py-4 flex justify-between">
          <div><p className="font-medium text-sm">{i.title}</p><div className="flex gap-2 mt-1"><span className="text-xs text-purple-500">{i.type}</span><span className="text-xs text-gray-400">{i.date}</span></div></div>
          {i.reward && <span className="text-sm font-bold text-blue-600">+{i.reward}P</span>}
        </div>
      ))}
      {items.length === 0 && <p className="p-8 text-center text-gray-400 text-sm">참여 내역이 없습니다.</p>}
    </div>
  );
}
