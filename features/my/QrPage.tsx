'use client';
import { useQrBarcode } from './hooks/useQrBarcode';
import { QrView } from './components/QrView/QrView';
export default function QrPage() { const { barcode, isLoading } = useQrBarcode(); return <QrView barcode={barcode} isLoading={isLoading} />; }
