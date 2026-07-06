/** [퍼블리셔] 설문 목록 화면 레이아웃 */
interface Survey { id: string; title: string; reward: number; isCompleted: boolean; expiresAt?: string; }
export function SurveyListView({ surveys = [], isLoading, onSurveyClick }: { surveys?: Survey[]; isLoading?: boolean; onSurveyClick?: (id: string) => void }) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  return (
    <div className="flex flex-col gap-3 p-4">
      {surveys.map(s => (
        <div key={s.id} onClick={() => onSurveyClick?.(s.id)} className={`p-4 border rounded-xl cursor-pointer ${s.isCompleted ? 'opacity-50' : ''}`}>
          <div className="flex justify-between"><p className="font-medium text-sm">{s.title}</p><span className="text-xs text-blue-600 font-bold">+{s.reward}P</span></div>
          {s.expiresAt && <p className="text-xs text-gray-400 mt-1">~{s.expiresAt}</p>}
          {s.isCompleted && <span className="text-xs text-green-600 font-medium mt-1 block">✓ 참여완료</span>}
        </div>
      ))}
      {surveys.length === 0 && <p className="text-center text-gray-400 text-sm">참여 가능한 설문이 없습니다.</p>}
    </div>
  );
}
