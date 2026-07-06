import { GNB } from '@/components/layout/GNB';
import { FNB } from '@/components/layout/FNB';

export default function EarnPage() {
  return (
    <>
      <GNB title="적립" />
      <main className="flex items-center justify-center pt-16 pb-20 min-h-screen bg-bg-secondary">
        <p className="text-base text-text-secondary">포인트 적립 내역 및 혜택 조회</p>
      </main>
      <FNB />
    </>
  );
}
