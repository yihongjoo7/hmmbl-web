/** [퍼블리셔] 설문 진행률 */
export function SurveyProgress({ current, total }: { current: number; total: number }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3 px-6 py-3 border-b">
      <div className="flex-1 bg-gray-100 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} /></div>
      <span className="text-xs text-gray-500 shrink-0">{current}/{total}</span>
    </div>
  );
}
