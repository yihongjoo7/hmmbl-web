/** [퍼블리셔] 게이지 미션 UI */
interface MissionGaugeProps { progress: number; total: number; milestones?: number[]; }
export function MissionGauge({ progress, total, milestones = [] }: MissionGaugeProps) {
  const pct = Math.min((progress / total) * 100, 100);
  return (
    <div className="relative">
      <div className="bg-gray-100 rounded-full h-4 relative overflow-hidden">
        <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-4 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between mt-1 text-xs text-gray-400"><span>0</span><span>{total}</span></div>
      {milestones.map(m => <div key={m} className="absolute top-0 h-4 w-0.5 bg-white" style={{ left: `${(m / total) * 100}%` }} />)}
    </div>
  );
}
