/** [퍼블리셔] 미션 목록 화면 레이아웃 */
interface Mission { id: string; title: string; reward: number; progress: number; total: number; isCompleted: boolean; }
interface MissionListViewProps { missions?: Mission[]; isLoading?: boolean; onMissionClick?: (id: string) => void; }
export function MissionListView({ missions = [], isLoading, onMissionClick }: MissionListViewProps) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  return (
    <div className="flex flex-col gap-3 p-4">
      {missions.map(m => (
        <div key={m.id} onClick={() => onMissionClick?.(m.id)} className="p-4 border rounded-xl cursor-pointer">
          <div className="flex justify-between items-start"><p className="font-medium text-sm">{m.title}</p><span className="text-xs text-blue-600 font-bold">{m.reward}P</span></div>
          <div className="mt-3 bg-gray-100 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min((m.progress / m.total) * 100, 100)}%` }} /></div>
          <p className="text-xs text-gray-400 mt-1">{m.progress}/{m.total}</p>
        </div>
      ))}
    </div>
  );
}
