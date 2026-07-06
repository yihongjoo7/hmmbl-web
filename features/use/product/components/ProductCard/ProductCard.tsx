/** [퍼블리셔] 상품 카드 (목록용) */
interface ProductCardProps { brand: string; title: string; point: number; onClick?: () => void; }
export function ProductCard({ brand, title, point, onClick }: ProductCardProps) {
  return (
    <div onClick={onClick} className="border rounded-xl overflow-hidden cursor-pointer">
      <div className="w-full aspect-square bg-gray-100" />
      <div className="p-3"><p className="text-xs text-gray-400">{brand}</p><p className="font-medium text-sm mt-0.5 truncate">{title}</p><p className="text-xs text-blue-600 font-bold mt-1">{point.toLocaleString()}P</p></div>
    </div>
  );
}
