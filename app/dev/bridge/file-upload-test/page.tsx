// 개발 허브 → 파일 업로드 테스트 진입점.
// 화면 구현은 features/_templates/file-upload-test/FileUploadTestPage.tsx 에 있다.
// 이 라우트는 app/dev/bridge/layout.tsx 의 Mock 브릿지(window.bridge) 주입을 상속하므로
// 네이티브 앱 없이 브라우저에서 카메라/갤러리 선택이 동작한다.
// (실제 업로드/다운로드는 백엔드 /files/* 엔드포인트가 필요)
export { default } from '@/features/_templates/file-upload-test/FileUploadTestPage';
