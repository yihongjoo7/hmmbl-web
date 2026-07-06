/** [퍼블리셔] 이용·구매 내역 항목 */
export function HistoryItem({ category, title, date, amount }: { category: string; title: string; date: string; amount: number }) {
  return (
    <div className="px-4 py-4 border-b">
      <div className="flex justify-between"><p className="font-medium text-sm">{title}</p><p className={`font-bold text-sm ${amount > 0 ? 'text-blue-600' : 'text-gray-700'}`}>{amount > 0 ? '+' : ''}{amount.toLocaleString()}P</p></div>
      <div className="flex gap-2 mt-1"><span className="text-xs text-blue-500">{category}</span><span className="text-xs text-gray-400">{date}</span></div>
    </div>
  );
}
