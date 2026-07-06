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
};

export default nextConfig;