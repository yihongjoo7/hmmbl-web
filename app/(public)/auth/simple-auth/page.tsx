/**
 * 간편인증 페이지 — 브릿지 연결 전 빈 화면
 *
 * 실제 흐름 (네이티브 브릿지 연결 시):
 * 1. window.bridge.requestAuthCode() 호출
 * 2. onBridgeEvent('appAuthCode', { code }) 수신
 * 3. initAuthFromCode(code) → DPoP 토큰 교환 → setAuth
 * 4. /main 으로 이동
 */
export default function SimpleAuthPage() {
  return null;
}
