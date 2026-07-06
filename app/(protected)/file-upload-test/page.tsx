// 파일 업로드 테스트 — 보호 라우트.
// android-mobile 카드3 진입 대상: {WEB_BASE_URL}/file-upload-test
//
// (protected)/layout.tsx 의 인증 가드를 상속한다.
//   - staging/prod: 미인증 시 /auth/simple-auth 로 리다이렉트 → webview-code SSO
//     (window.bridge.requestAuthCode → /auth/webview-code → /auth/token) 자동 트리거.
//   - dev(NODE_ENV=development): 가드 미적용(미인증 접근 허용) — dev 인증은 /dev/auth 등으로 처리.
//   - /dev/bridge 의 Mock 브릿지가 닿지 않으므로 실기기에서 실제 네이티브 브릿지
//     (카메라/갤러리/업로드/다운로드)가 동작한다.
//   - 루트 layout 의 LocaleProvider 도 그대로 상속하므로 언어 동기화가 동작한다.
//
// 화면 구현은 features/_templates/file-upload-test/FileUploadTestPage.tsx (공유).
// (브라우저 Mock 테스트용 변형은 /dev/bridge/file-upload-test 에 유지.)
export { default } from '@/features/_templates/file-upload-test/FileUploadTestPage';
