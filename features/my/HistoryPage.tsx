'use client';
import { useHistory } from './hooks/useHistory';
import { HistoryView } from './components/HistoryView/HistoryView';
export default function HistoryPage() { const { items, isLoading } = useHistory(); return <HistoryView items={items} isLoading={isLoading} />; }
