/** [퍼블리셔] 미션 상세 화면 레이아웃 */
interface MissionDetailViewProps { mission?: { title: string; description?: string; reward: number; progress: number; total: number; isCompleted: boolean }; isLoading?: boolean; onParticipate?: () => void; }
export function MissionDetailView({ mission, isLoading, onParticipate }: MissionDetailViewProps) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  if (!mission) return null;
  return (
    <div className="flex flex-col gap-6 p-6 pb-24">
      <h1 className="text-xl font-bold">{mission.title}</h1>
      {mission.description && <p className="text-sm text-gray-500">{mission.description}</p>}
      <div className="bg-blue-50 rounded-xl p-4 text-center"><p className="text-2xl font-bold text-blue-600">{mission.reward}P</p><p className="text-xs text-gray-500 mt-1">달성 시 적립</p></div>
      <div><p className="text-xs text-gray-500 mb-1">진행률 {mission.progress}/{mission.total}</p><div className="bg-gray-100 rounded-full h-3"><div className="bg-blue-500 h-3 rounded-full" style={{ width: `${Math.min((mission.progress / mission.total) * 100, 100)}%` }} /></div></div>
      {!mission.isCompleted && <button onClick={onParticipate} className="fixed bottom-6 left-6 right-6 py-4 bg-blue-600 text-white rounded-xl font-bold">참여하기</button>}
    </div>
  );
}
