'use client';
import { useBrandPayment } from './hooks/useBrandPayment';
import { BrandPaymentView } from './components/BrandPaymentView/BrandPaymentView';
export default function BrandPaymentPage() { const { merchants, barcode, isLoading, requestBarcode } = useBrandPayment(); return <BrandPaymentView merchants={merchants} barcode={barcode} isLoading={isLoading} onRequestBarcode={requestBarcode} />; }
