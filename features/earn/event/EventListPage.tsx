'use client';
import { useEventList } from './hooks/useEventList';
import { EventListView } from './components/EventListView/EventListView';
export default function EventListPage() { const { events, isLoading } = useEventList(); return <EventListView events={events} isLoading={isLoading} />; }
