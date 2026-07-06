/** [퍼블리셔] 카드 항목 */
export function CardItem({ name, last4, isPrimary, onSetPrimary, onDelete }: { name: string; last4: string; isPrimary?: boolean; onSetPrimary?: () => void; onDelete?: () => void }) {
  return <div className="flex items-center gap-4 p-4 border rounded-xl"><div className="w-10 h-7 bg-gradient-to-r from-blue-400 to-blue-600 rounded" /><div className="flex-1"><p className="font-medium text-sm">{name}</p><p className="text-xs text-gray-400">**** {last4}</p></div>{!isPrimary && <button onClick={onSetPrimary} className="text-xs text-blue-600">주카드 설정</button>}<button onClick={onDelete} className="text-xs text-red-400 ml-2">삭제</button></div>;
}
