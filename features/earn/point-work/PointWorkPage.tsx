'use client';
import { usePointWork } from './hooks/usePointWork';
import { PointWorkView } from './components/PointWorkView/PointWorkView';
export default function PointWorkPage() {
  const { dashboard, isLoading } = usePointWork();
  return <PointWorkView dashboard={dashboard} isLoading={isLoading} />;
}
