'use client';
import { usePointManagement } from './hooks/usePointManagement';
import { PointView } from './components/PointView/PointView';
export default function PointPage() { const { summary, isLoading } = usePointManagement(); return <PointView summary={summary} isLoading={isLoading} />; }
