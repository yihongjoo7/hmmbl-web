'use client';
import { useInterestPoint } from './hooks/useInterestPoint';
import { InterestPointView } from './components/InterestPointView/InterestPointView';
export default function InterestPointPage() { const { points, isLoading } = useInterestPoint(); return <InterestPointView points={points} isLoading={isLoading} />; }
