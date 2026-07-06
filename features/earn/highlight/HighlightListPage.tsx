'use client';
import { useHighlightList } from './hooks/useHighlightList';
import { HighlightListView } from './components/HighlightListView/HighlightListView';
export default function HighlightListPage() { const { highlights, isLoading } = useHighlightList(); return <HighlightListView highlights={highlights} isLoading={isLoading} />; }
