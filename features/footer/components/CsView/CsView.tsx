/** [퍼블리셔] 고객센터 화면 레이아웃 */
interface Faq { id: string; question: string; answer: string; }
export function CsView({ faqs = [], isLoading, onInquiry }: { faqs?: Faq[]; isLoading?: boolean; onInquiry?: () => void }) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-xl font-bold">고객센터</h1>
      <button onClick={onInquiry} className="w-full py-3 border border-blue-600 text-blue-600 rounded-xl font-medium text-sm">1:1 문의하기</button>
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-bold text-gray-700">자주 묻는 질문</h2>
        {faqs.map(f => <details key={f.id} className="border rounded-xl"><summary className="px-4 py-3 text-sm font-medium cursor-pointer">{f.question}</summary><p className="px-4 pb-3 text-sm text-gray-500 leading-relaxed">{f.answer}</p></details>)}
      </div>
    </div>
  );
}
