'use client';
import { useWishlist } from './hooks/useWishlist';
import { WishlistView } from './components/WishlistView/WishlistView';
export default function WishlistPage() { const { items, isLoading } = useWishlist(); return <WishlistView items={items} isLoading={isLoading} />; }
