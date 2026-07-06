/** [퍼블리셔] 컬처 카드 */
export function CultureCard({ title, category, point, onClick }: { title: string; category: string; point: number; onClick?: () => void }) {
  return <div onClick={onClick} className="border rounded-xl overflow-hidden cursor-pointer"><div className="w-full aspect-square bg-gray-100" /><div className="p-3"><span className="text-xs text-blue-500">{category}</span><p className="font-medium text-sm mt-0.5 truncate">{title}</p><p className="text-xs text-blue-600 font-bold mt-1">{point.toLocaleString()}P</p></div></div>;
}
