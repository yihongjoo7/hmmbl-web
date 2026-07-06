// Bridge 이벤트 공통 타입
export type BridgeEventType =
  | 'TOKEN_RECEIVED'
  | 'KEY_ROTATION'
  | 'BACK_PRESS'
  | 'LOCATION_UPDATE'
  | 'STEP_COUNT_UPDATE'
  | 'CAMERA_RESULT'
  | 'FILE_SELECTED'
  | 'LOCALE_CHANGE'
  | 'APP_UPDATE';

export interface BridgeEvent<T = unknown> {
  type: BridgeEventType;
  payload: T;
}
