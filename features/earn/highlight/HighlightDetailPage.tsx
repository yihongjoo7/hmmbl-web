'use client';
import { useHighlightDetail } from './hooks/useHighlightDetail';
import { HighlightDetailView } from './components/HighlightDetailView/HighlightDetailView';
export default function HighlightDetailPage({ id }: { id: string }) { const { highlight, isLoading, claim } = useHighlightDetail(id); return <HighlightDetailView highlight={highlight} isLoading={isLoading} onClaim={claim} />; }
