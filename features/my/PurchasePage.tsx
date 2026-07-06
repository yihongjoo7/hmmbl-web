'use client';
import { usePurchaseHistory } from './hooks/usePurchaseHistory';
import { PurchaseView } from './components/PurchaseView/PurchaseView';
export default function PurchasePage() { const { purchases, isLoading } = usePurchaseHistory(); return <PurchaseView purchases={purchases} isLoading={isLoading} />; }
