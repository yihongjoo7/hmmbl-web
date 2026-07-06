'use client';

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';

export default function DevLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  // 네이티브 웹뷰에서는 dev 사이드바(검은 좌측 메뉴)를 숨긴다 — 앱 카드 화면은 풀스크린.
  // 기본 숨김으로 두고, 브라우저(dev 허브)로 확인되면 표시한다(웹뷰에서 깜빡임 없음).
  const [showSidebar, setShowSidebar] = useState(false);
  useEffect(() => {
    const isWebView =
      typeof window !== 'undefined' &&
      typeof (window as Window & { bridge?: unknown }).bridge !== 'undefined';
    if (!isWebView) setShowSidebar(true);
  }, []);

  // 웹뷰: 사이드바 없이 페이지만 풀스크린으로 렌더
  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex">
      <nav className={`${collapsed ? 'w-10' : 'w-60'} bg-gray-900 text-white flex-shrink-0 flex flex-col transition-[width] duration-200 overflow-hidden`}>
        <button
          type="button"
          onClick={() => setCollapsed(c => !c)}
          className="flex items-center justify-center w-10 h-10 flex-shrink-0 text-gray-400 hover:text-white hover:bg-gray-700"
        >
          {collapsed ? '›' : '‹'}
        </button>

        {!collapsed && (
          <div className="flex flex-col gap-5 px-4 pb-6 overflow-y-auto text-sm">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Home</p>
              <Link href="/dev" className="block py-1 px-2 rounded hover:bg-gray-700">대시보드</Link>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">화면</p>
              <Link href="/dev/ia"  className="block py-1 px-2 rounded hover:bg-gray-700">IA 네비게이터</Link>
              <Link href="/dev/pub" className="block py-1 px-2 rounded hover:bg-gray-700">퍼블리셔 화면</Link>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">가이드</p>
              <Link href="/dev/ref/publisher" className="block py-1 px-2 rounded hover:bg-gray-700">퍼블리셔 레퍼런스</Link>
              <Link href="/dev/ref/developer" className="block py-1 px-2 rounded hover:bg-gray-700">개발자 레퍼런스</Link>
              <Link href="/dev/ref/preview"   className="block py-1 px-2 rounded hover:bg-gray-700">📱 화면 미리보기</Link>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">도구</p>
              <Link href="/dev/ui"     className="block py-1 px-2 rounded hover:bg-gray-700">UI 카탈로그</Link>
              <Link href="/dev/bridge" className="block py-1 px-2 rounded hover:bg-gray-700">Bridge 테스트</Link>
              <Link href="/dev/auth"   className="block py-1 px-2 rounded hover:bg-gray-700">인증 디버그</Link>
            </div>
          </div>
        )}
      </nav>
      <main className="flex-1 p-6 bg-gray-50 overflow-auto">{children}</main>
    </div>
  );
}
