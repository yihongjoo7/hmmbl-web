import { GNB } from '@/components/layout/GNB';
import { FNB } from '@/components/layout/FNB';

export default function MenuPage() {
  return (
    <>
      <GNB title="메뉴" />
      <main className="flex items-center justify-center pt-16 pb-20 min-h-screen bg-bg-secondary">
        <p className="text-base text-text-secondary">전체 메뉴 보기</p>
      </main>
      <FNB />
    </>
  );
}
