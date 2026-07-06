import { GNB } from '@/components/layout/GNB';
import { FNB } from '@/components/layout/FNB';

export default function IntroPage() {
  return (
    <>
      <GNB title="소개" />
      <main className="flex items-center justify-center pt-16 pb-20 min-h-screen bg-bg-secondary">
        <p className="text-base text-text-secondary">H.Point 서비스 소개</p>
      </main>
      <FNB />
    </>
  );
}
