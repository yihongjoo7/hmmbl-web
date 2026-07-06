/** [퍼블리셔] 하이라이트 카드 */
interface HLCardProps { brand: string; title: string; reward: number; onClick?: () => void; }
export function HighlightCard({ brand, title, reward, onClick }: HLCardProps) {
  return <div onClick={onClick} className="p-4 border rounded-xl cursor-pointer"><p className="text-xs text-gray-400">{brand}</p><p className="font-medium text-sm mt-0.5">{title}</p><p className="text-xs text-blue-600 font-bold mt-1">+{reward}P</p></div>;
}
