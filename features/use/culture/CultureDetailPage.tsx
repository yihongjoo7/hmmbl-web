'use client';
import { useCultureDetail } from './hooks/useCultureDetail';
import { CultureDetailView } from './components/CultureDetailView/CultureDetailView';
export default function CultureDetailPage({ id }: { id: string }) { const { item, isLoading } = useCultureDetail(id); return <CultureDetailView item={item} isLoading={isLoading} />; }
