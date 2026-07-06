/** [퍼블리셔] 제휴처 목록 항목 */
export function AffiliateListItem({ name, category, address, distance, onClick }: { name: string; category?: string; address: string; distance?: string; onClick?: () => void }) {
  return <div onClick={onClick} className="px-4 py-3 border-b cursor-pointer hover:bg-gray-50"><div className="flex justify-between"><p className="font-medium text-sm">{name}</p>{distance && <span className="text-xs text-gray-400">{distance}</span>}</div>{category && <span className="text-xs text-blue-500">{category}</span>}<p className="text-xs text-gray-400 mt-0.5">{address}</p></div>;
}
