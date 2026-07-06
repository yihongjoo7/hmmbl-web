import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Providers } from './providers';
import { WebviewLayoutClient } from './WebviewLayoutClient';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'H.Point',
  description: 'H.Point 멤버십 앱',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // proxy가 request header로 전달한 nonce를 읽는다.
  // prod CSP(script-src 'nonce-...') 적용 시 인라인 스크립트에 이 값을 사용한다.
  const nonce = (await headers()).get('x-nonce') ?? '';

  return (
    <html lang="ko">
      <body>
        <Providers nonce={nonce}>
          <WebviewLayoutClient>{children}</WebviewLayoutClient>
        </Providers>
      </body>
    </html>
  );
}
