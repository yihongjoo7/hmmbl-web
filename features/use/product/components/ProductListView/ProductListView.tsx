/** [퍼블리셔] 상품 목록 화면 레이아웃 */
interface Product { id: string; brand: string; title: string; price: number; point: number; }
export function ProductListView({ products = [], isLoading, onProductClick }: { products?: Product[]; isLoading?: boolean; onProductClick?: (id: string) => void }) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {products.map(p => (
        <div key={p.id} onClick={() => onProductClick?.(p.id)} className="border rounded-xl overflow-hidden cursor-pointer">
          <div className="w-full aspect-square bg-gray-100" />
          <div className="p-3"><p className="text-xs text-gray-400">{p.brand}</p><p className="font-medium text-sm mt-0.5 truncate">{p.title}</p><p className="text-xs text-blue-600 font-bold mt-1">{p.point.toLocaleString()}P</p></div>
        </div>
      ))}
    </div>
  );
}
