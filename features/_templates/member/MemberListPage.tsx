'use client';
/**
 * features/_templates/member/MemberListPage.tsx
 *
 * 테스트용 템플릿: nextjs-new 의 멤버리스트 화면
 *   (app/m/(public)/member/list/page.tsx)을 복사한 것.
 * 개발 허브(/dev)의 "멤버목록" 카드 → /dev/member-list 라우트에서 렌더된다.
 *
 * 변경점: feature import를 동일 폴더 상대경로로 조정.
 */
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { memberApi } from './services/memberApi';
import { MemberCallButton } from './components/MemberCallButton';

export default function MemberListPage() {
  const t = useTranslations('member');

  const [serverTime, setServerTime] = useState<string | null>(null);
  const [error,      setError]      = useState<string | null>(null);

  async function handleServerCall() {
    setError(null);
    try {
      const res = await memberApi.getServerTime();
      const pad = (n: number) => String(n).padStart(2, '0');
      setServerTime(
        `${res.year}-${pad(res.month)}-${pad(res.day)} ` +
        `${pad(res.hour)}:${pad(res.minute)}:${pad(res.second)}`
      );
    } catch {
      setError('서버 호출에 실패했습니다.');
    }
  }

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold text-text-primary mb-3">{t('hub.listTitle')}</h1>
      <p className="text-text-secondary text-sm">{t('list.placeholder')}</p>
      {/* MemberCallButton: features/_templates/member 전용 버튼. 다른 화면에는 영향 없음. */}
      <MemberCallButton
        onClick={handleServerCall}
        className="mt-5"
      >
        {t('list.serverCall')}
      </MemberCallButton>
      {serverTime && (
        <p className="mt-3 text-text-primary text-sm font-mono">{serverTime}</p>
      )}
      {error && (
        <p className="mt-3 text-error text-xs">{error}</p>
      )}
    </main>
  );
}
