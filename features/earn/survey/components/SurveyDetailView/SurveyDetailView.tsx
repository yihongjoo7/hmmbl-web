/** [퍼블리셔] 설문 상세 화면 레이아웃 */
interface Question { id: string; text: string; type: 'single' | 'multi' | 'short' | 'scale' | 'matrix' | 'slider' | 'video'; choices?: string[]; }
interface SurveyDetailViewProps { title?: string; questions?: Question[]; currentIndex?: number; onAnswer?: (qId: string, answer: unknown) => void; onNext?: () => void; onSubmit?: () => void; isLoading?: boolean; }
export function SurveyDetailView({ title, questions = [], currentIndex = 0, onAnswer, onNext, onSubmit, isLoading }: SurveyDetailViewProps) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  const q = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  return (
    <div className="flex flex-col gap-6 p-6 pb-24">
      <h1 className="text-xl font-bold">{title}</h1>
      {q && (
        <div className="flex flex-col gap-4">
          <p className="font-medium">{currentIndex + 1}. {q.text}</p>
          {q.choices?.map((c, i) => (
            <label key={i} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input type={q.type === 'multi' ? 'checkbox' : 'radio'} name={q.id} onChange={() => onAnswer?.(q.id, c)} className="w-4 h-4" />
              <span className="text-sm">{c}</span>
            </label>
          ))}
          {q.type === 'short' && <textarea rows={3} onChange={e => onAnswer?.(q.id, e.target.value)} className="w-full border rounded-lg p-3 text-sm resize-none" placeholder="답변을 입력하세요" />}
          {q.type === 'scale' && (
            <div className="flex justify-between gap-1">
              {[1,2,3,4,5].map(n => <button key={n} onClick={() => onAnswer?.(q.id, n)} className="flex-1 py-3 border rounded-lg text-sm hover:bg-blue-50 hover:border-blue-400">{n}</button>)}
            </div>
          )}
        </div>
      )}
      <button onClick={isLast ? onSubmit : onNext} className="fixed bottom-6 left-6 right-6 py-4 bg-blue-600 text-white rounded-xl font-bold">
        {isLast ? '제출하기' : '다음'}
      </button>
    </div>
  );
}
