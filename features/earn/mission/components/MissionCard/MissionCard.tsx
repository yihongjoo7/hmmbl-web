/** [퍼블리셔] 미션 카드 */
interface MissionCardProps { title: string; reward: number; progress: number; total: number; isCompleted: boolean; onClick?: () => void; }
export function MissionCard({ title, reward, progress, total, isCompleted, onClick }: MissionCardProps) {
  return (
    <div onClick={onClick} className={`p-4 border rounded-xl cursor-pointer ${isCompleted ? 'opacity-60' : ''}`}>
      <div className="flex justify-between"><p className="font-medium text-sm">{title}</p><span className="text-xs text-blue-600 font-bold">+{reward}P</span></div>
      <div className="mt-2 bg-gray-100 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min((progress / total) * 100, 100)}%` }} /></div>
    </div>
  );
}
