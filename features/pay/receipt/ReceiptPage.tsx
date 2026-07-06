'use client';
import { useReceipt } from './hooks/useReceipt';
import { ReceiptPageView } from './components/ReceiptPageView/ReceiptPageView';
export default function ReceiptPage() { const { receipts, isLoading } = useReceipt(); return <ReceiptPageView receipts={receipts} isLoading={isLoading} />; }
