// IP 접속 허용 목록 (.env.local 의 ALLOWED_DEV_ORIGINS, 콤마 구분)
// 미설정 시 localhost·127.0.0.1 만 허용
const allowedDevOrigins = (process.env.ALLOWED_DEV_ORIGINS ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // next-intl 플러그인 없음 (WebView 전용 — 다국어 불필요)
  allowedDevOrigins: allowedDevOrigins.length ? allowedDevOrigins : ['localhost', '127.0.0.1'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.hpoint.com' },
    ],
  },
  // Turbopack이 pino의 동적 transport(worker_threads, pino-pretty)를
  // 정적으로 추적하지 못해 instrumentation.ts 번들링이 실패하는 문제 방지
  // (MODULE_UNPARSABLE: Could not parse module 'instrumentation.ts')
  serverExternalPackages: ['pino', 'pino-pretty', 'thread-stream'],
};

export default nextConfig;