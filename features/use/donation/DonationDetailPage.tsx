'use client';
import { useDonationDetail } from './hooks/useDonationDetail';
import { DonationDetailView } from './components/DonationDetailView/DonationDetailView';
export default function DonationDetailPage({ id }: { id: string }) { const { donation, isLoading, donate } = useDonationDetail(id); return <DonationDetailView donation={donation} isLoading={isLoading} onDonate={donate} />; }
