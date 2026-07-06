/** [퍼블리셔] 자주묻는질문 항목 */
export function FaqItem({ question, answer }: { question: string; answer: string }) {
  return <details className="border rounded-xl group"><summary className="px-4 py-3 text-sm font-medium cursor-pointer list-none flex justify-between items-center"><span>{question}</span><span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span></summary><p className="px-4 pb-4 text-sm text-gray-500 leading-relaxed border-t pt-3">{answer}</p></details>;
}
