/** [퍼블리셔] 문항 유형별 렌더러 */
interface SurveyQuestionProps { question: { id: string; text: string; type: string; choices?: string[] }; onAnswer: (answer: unknown) => void; }
export function SurveyQuestion({ question: q, onAnswer }: SurveyQuestionProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-medium text-sm">{q.text}</p>
      {q.choices?.map((c, i) => (
        <label key={i} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
          <input type={q.type === 'multi' ? 'checkbox' : 'radio'} name={q.id} onChange={() => onAnswer(c)} className="w-4 h-4" />
          <span className="text-sm">{c}</span>
        </label>
      ))}
      {q.type === 'short' && <textarea rows={3} onChange={e => onAnswer(e.target.value)} className="w-full border rounded-lg p-3 text-sm resize-none" placeholder="답변을 입력하세요" />}
      {q.type === 'slider' && <input type="range" min={0} max={100} onChange={e => onAnswer(Number(e.target.value))} className="w-full" />}
    </div>
  );
}
