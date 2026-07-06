'use client';
import { useEventDetail } from './hooks/useEventDetail';
import { EventDetailView } from './components/EventDetailView/EventDetailView';
export default function EventDetailPage({ id }: { id: string }) { const { event, isLoading, participate } = useEventDetail(id); return <EventDetailView event={event} isLoading={isLoading} onParticipate={participate} />; }
