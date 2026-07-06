/**
 * 퍼블리셔 화면 미리보기용 래퍼
 *
 * GNB/FNB를 포함한 앱 레이아웃을 시뮬레이션합니다
 * dev/pub/* 라우트에서 사용합니다
 */

import type { ReactNode } from 'react';

interface PubLayoutProps {
  title?: string;
  children: ReactNode;
}

export function PubLayout({ title, children }: PubLayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-white max-w-[390px] mx-auto border-x border-gray-200">
      {/* 목업 GNB */}
      <header className="flex items-center h-12 px-4 border-b border-gray-100">
        <button className="mr-3 text-gray-500">←</button>
        <span className="font-medium text-base">{title ?? 'H.Point'}</span>
      </header>

      {/* 화면 콘텐츠 */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
