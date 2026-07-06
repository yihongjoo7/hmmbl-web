'use client';
import { useProductDetail } from './hooks/useProductDetail';
import { ProductDetailView } from './components/ProductDetailView/ProductDetailView';
export default function ProductDetailPage({ id }: { id: string }) { const { product, isLoading, purchase } = useProductDetail(id); return <ProductDetailView product={product} isLoading={isLoading} onPurchase={purchase} />; }
