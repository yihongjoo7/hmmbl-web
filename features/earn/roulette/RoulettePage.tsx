'use client';
import { useRoulette } from './hooks/useRoulette';
import { RouletteView } from './components/RouletteView/RouletteView';
export default function RoulettePage() {
  const { isSpinning, result, spin, canSpin } = useRoulette();
  return <RouletteView isSpinning={isSpinning} result={result} onSpin={spin} canSpin={canSpin} />;
}
