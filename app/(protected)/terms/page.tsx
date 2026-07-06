import { GNB } from '@/components/layout/GNB';
import { FNB } from '@/components/layout/FNB';

export default function TermsPage() {
  return (
    <>
      <GNB title="약관" />
      <main className="flex items-center justify-center pt-16 pb-20 min-h-screen bg-bg-secondary">
        <p className="text-base text-text-secondary">이용약관 및 개인정보처리방침</p>
      </main>
      <FNB />
    </>
  );
}
