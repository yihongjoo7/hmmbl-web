// 개발 허브 → 브릿지 통합 테스트 진입점.
// 화면 구현은 features/_templates/bridge-test/BridgeTestPage.tsx 에 있다.
// 이 라우트는 app/dev/bridge/layout.tsx 의 Mock 브릿지(window.bridge) 주입을 상속하므로
// 네이티브 앱 없이 브라우저에서 버튼이 동작한다.
export { default } from '@/features/_templates/bridge-test/BridgeTestPage';
