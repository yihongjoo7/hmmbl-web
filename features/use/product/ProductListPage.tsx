'use client';
import { useProductList } from './hooks/useProductList';
import { ProductListView } from './components/ProductListView/ProductListView';
export default function ProductListPage() { const { products, isLoading } = useProductList(); return <ProductListView products={products} isLoading={isLoading} />; }
