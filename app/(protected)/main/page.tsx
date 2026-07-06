'use client';

import Link from 'next/link';
import { useState } from 'react';
import { GNB } from '@/components/layout/GNB';
import { FNB } from '@/components/layout/FNB';
import { useAuthStore } from '@/features/auth/hooks/useAuthStore';

// ── 타입 ──────────────────────────────────────────────────────────────────
type MenuHref =
  | '/earn'
  | '/pay'
  | '/my'
  | '/menu'
  | '/search'
  | '/intro'
  | '/terms'
  | '/use'
  | '/dev';

interface MenuItem {
  href:         MenuHref;
  icon:         string;
  title:        string;
  desc:         string;
  requiresAuth: boolean;
  isDevPath:    boolean;
}

// ── 메뉴 정의 ──────────────────────────────────────────────────────────────
const MENU_ITEMS: MenuItem[] = [
  { href: '/earn',   icon: '🎁', title: '적립',    desc: '포인트 적립 내역 및 혜택 조회', requiresAuth: false,  isDevPath: false },
  { href: '/pay',    icon: '💳', title: '결제',    desc: '포인트 결제 및 사용 현황',      requiresAuth: false,  isDevPath: false },
  { href: '/my',     icon: '👤', title: '마이',    desc: '내 정보 및 계정 설정',          requiresAuth: false,  isDevPath: false },
  { href: '/menu',   icon: '☰',  title: '메뉴',    desc: '전체 메뉴 보기',               requiresAuth: false, isDevPath: false },
  { href: '/search', icon: '🔍', title: '검색',    desc: '서비스 검색',                  requiresAuth: false, isDevPath: false },
  { href: '/intro',  icon: '📖', title: '소개',    desc: 'H.Point 서비스 소개',          requiresAuth: false, isDevPath: false },
  { href: '/terms',  icon: '📄', title: '약관',    desc: '이용약관 및 개인정보처리방침',   requiresAuth: false, isDevPath: false },
  { href: '/use',    icon: '📋', title: '이용안내', desc: '서비스 이용 안내',             requiresAuth: false, isDevPath: false },
  { href: '/dev',    icon: '🛠️', title: '테스트',  desc: '개발·UI·브릿지 테스트 도구',   requiresAuth: false, isDevPath: true  },
];

// ── 페이지 ──────────────────────────────────────────────────────────────────
export default function MainPage() {
  const { isAuthenticated } = useAuthStore();
  const [showLoginMsg, setShowLoginMsg] = useState(false);

  // 브릿지 미연결 시에도 메뉴 표시 (isInitialized는 네이티브 인증 완료 후 true가 됨)
  function handleProtectedClick() {
    setShowLoginMsg(true);
    setTimeout(() => setShowLoginMsg(false), 2500);
  }

  const cardClass =
    'flex flex-col gap-2 p-5 bg-bg-primary rounded-xl border border-border-default hover:border-border-hover hover:shadow-sm transition-all';

  return (
    <>
      <GNB />

      <main className="pt-16 pb-20 min-h-screen bg-bg-secondary">
        {showLoginMsg && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-text-primary text-text-inverse text-sm px-5 py-3 rounded-xl shadow-lg">
            로그인이 필요합니다
          </div>
        )}

        <div className="w-full text-center py-6">
          <p className="text-base font-semibold text-text-secondary tracking-widest">NextJS Example</p>
        </div>

        <div className="max-w-4xl mx-auto px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MENU_ITEMS.map((item) => {
              const blocked = item.requiresAuth && !isAuthenticated;

              const cardContent = (
                <>
                  <span className="text-3xl">{item.icon}</span>
                  <h2 className="text-base font-bold text-text-primary">{item.title}</h2>
                  <p className="text-sm text-text-secondary">{item.desc}</p>
                </>
              );

              if (blocked) {
                return (
                  <button
                    key={item.href}
                    onClick={handleProtectedClick}
                    className="flex flex-col gap-2 p-5 bg-bg-primary rounded-xl border border-border-default text-left opacity-60 hover:opacity-80 hover:border-border-muted transition-all cursor-pointer"
                  >
                    {cardContent}
                  </button>
                );
              }

              return (
                <Link key={item.href} href={item.href} className={cardClass}>
                  {cardContent}
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      <FNB />
    </>
  );
}
