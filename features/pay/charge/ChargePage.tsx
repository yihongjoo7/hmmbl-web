'use client';
import { useInstantCharge } from './hooks/useInstantCharge';
import { ChargeView } from './components/ChargeView/ChargeView';
export default function ChargePage() { const { charge, isLoading } = useInstantCharge(); return <ChargeView onCharge={charge} isLoading={isLoading} />; }
