/** [퍼블리셔] 카드 관리 화면 레이아웃 */
interface Card { id: string; name: string; last4: string; isPrimary: boolean; }
export function CardView({ cards = [], isLoading, onAddCard }: { cards?: Card[]; isLoading?: boolean; onAddCard?: () => void }) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between"><h1 className="text-xl font-bold">카드/Pay 관리</h1><button onClick={onAddCard} className="text-blue-600 text-sm font-medium">+ 카드 등록</button></div>
      {cards.map(c => (
        <div key={c.id} className="flex items-center gap-4 p-4 border rounded-xl">
          <div className="w-12 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-md" />
          <div className="flex-1"><p className="font-medium text-sm">{c.name}</p><p className="text-xs text-gray-400">**** {c.last4}</p></div>
          {c.isPrimary && <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">주카드</span>}
        </div>
      ))}
      {cards.length === 0 && <p className="p-6 text-center text-gray-400 text-sm">등록된 카드가 없습니다.</p>}
    </div>
  );
}
