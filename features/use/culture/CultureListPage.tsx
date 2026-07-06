'use client';
import { useCultureList } from './hooks/useCultureList';
import { CultureListView } from './components/CultureListView/CultureListView';
export default function CultureListPage() { const { items, isLoading } = useCultureList(); return <CultureListView items={items} isLoading={isLoading} />; }
