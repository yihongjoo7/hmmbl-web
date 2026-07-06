import { GNB } from '@/components/layout/GNB';
import { FNB } from '@/components/layout/FNB';

export default function PayPage() {
  return (
    <>
      <GNB title="결제" />
      <main className="flex items-center justify-center pt-16 pb-20 min-h-screen bg-bg-secondary">
        <p className="text-base text-text-secondary">포인트 결제 및 사용 현황</p>
      </main>
      <FNB />
    </>
  );
}
