/**
 * app/blocked/page.tsx
 *
 * 네이티브 WebView 외(일반 브라우저)에서 접근 시 표시되는 안내 페이지.
 * proxy.ts의 WebView UA 게이트가 비-dev에서 비-네이티브 요청을 이 경로로 rewrite한다.
 *
 * 게이트 예외: proxy는 pathname === '/blocked'를 통과시켜 무한 rewrite를 방지한다.
 * 라우트 그룹 밖(루트)에 두어 (protected)/(public) 레이아웃 가드의 영향을 받지 않는다.
 */
export default function BlockedPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 p-8 text-center">
      <span className="text-4xl" aria-hidden="true">📱</span>
      <h1 className="text-lg font-bold text-text-primary">앱에서 열어주세요</h1>
      <p className="text-sm text-text-secondary">
        이 페이지는 H.Point 앱에서만 이용할 수 있습니다.
      </p>
    </main>
  );
}
