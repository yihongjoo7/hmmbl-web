'use client';
import { useActivity } from './hooks/useActivity';
import { ActivityView } from './components/ActivityView/ActivityView';
export default function ActivityPage() { const { items, isLoading } = useActivity(); return <ActivityView items={items} isLoading={isLoading} />; }
