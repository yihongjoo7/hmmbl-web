/** [퍼블리셔] 상품 상세 화면 레이아웃 */
interface ProductDetail { brand: string; title: string; price: number; point: number; description?: string; }
export function ProductDetailView({ product, isLoading, onPurchase }: { product?: ProductDetail; isLoading?: boolean; onPurchase?: () => void }) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  if (!product) return null;
  return (
    <div className="flex flex-col gap-6 pb-24">
      <div className="w-full aspect-square bg-gray-100" />
      <div className="px-6 flex flex-col gap-4">
        <p className="text-xs text-gray-400">{product.brand}</p>
        <h1 className="text-xl font-bold">{product.title}</h1>
        <div className="flex items-center justify-between"><span className="text-sm text-gray-400 line-through">{product.price.toLocaleString()}원</span><span className="text-xl font-bold text-blue-600">{product.point.toLocaleString()}P</span></div>
        {product.description && <p className="text-sm text-gray-500 leading-relaxed">{product.description}</p>}
        <button onClick={onPurchase} className="fixed bottom-6 left-6 right-6 py-4 bg-blue-600 text-white rounded-xl font-bold">구매하기</button>
      </div>
    </div>
  );
}
