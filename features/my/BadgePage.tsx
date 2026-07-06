'use client';
import { useBadge } from './hooks/useBadge';
import { BadgeView } from './components/BadgeView/BadgeView';
export default function BadgePage() { const { badges, isLoading } = useBadge(); return <BadgeView badges={badges} isLoading={isLoading} />; }
