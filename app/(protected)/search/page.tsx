import { GNB } from '@/components/layout/GNB';
import { FNB } from '@/components/layout/FNB';

export default function SearchPage() {
  return (
    <>
      <GNB title="검색" />
      <main className="flex items-center justify-center pt-16 pb-20 min-h-screen bg-bg-secondary">
        <p className="text-base text-text-secondary">서비스 검색</p>
      </main>
      <FNB />
    </>
  );
}
