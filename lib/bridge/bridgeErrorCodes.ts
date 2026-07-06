/**
 * lib/bridge/bridgeErrorCodes.ts
 *
 * 하위 호환 re-export.
 * 실제 구현: lib/bridge/bridgeProtocol.ts
 *
 * 이 파일은 @/lib/bridge/bridgeErrorCodes 경로로 직접 import하는
 * 기존 파일들을 위해 존재한다.
 * 신규 코드는 @/lib/bridge (배럴)를 사용할 것.
 */
export { BridgeErrorCode } from './bridgeProtocol';
