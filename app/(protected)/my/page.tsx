import { GNB } from '@/components/layout/GNB';
import { FNB } from '@/components/layout/FNB';

export default function MyPage() {
  return (
    <>
      <GNB title="마이" />
      <main className="flex items-center justify-center pt-16 pb-20 min-h-screen bg-bg-secondary">
        <p className="text-base text-text-secondary">내 정보 및 계정 설정</p>
      </main>
      <FNB />
    </>
  );
}
