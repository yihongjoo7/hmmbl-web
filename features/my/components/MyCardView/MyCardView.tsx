/** [퍼블리셔] 보유카드 레이아웃 */
interface MyCard { id: string; name: string; last4: string; isPrimary: boolean; }
export function MyCardView({ cards = [], isLoading }: { cards?: MyCard[]; isLoading?: boolean }) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  return (
    <div className="flex flex-col gap-3 p-4">
      <h1 className="text-xl font-bold">보유카드</h1>
      {cards.map(c => (
        <div key={c.id} className="flex items-center gap-4 border rounded-xl p-4">
          <div className="w-12 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-md shrink-0" />
          <div className="flex-1"><p className="font-medium text-sm">{c.name}</p><p className="text-xs text-gray-400">**** {c.last4}</p></div>
          {c.isPrimary && <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">주카드</span>}
        </div>
      ))}
    </div>
  );
}
