/**
 * features/video/types/video.ts
 *
 * 비디오 플레이어 관련 타입 정의
 *
 * VideoPlayerProps  — VideoPlayer 컴포넌트 props
 * VideoState        — 재생 상태 (재생 중 / 일시정지 / 종료 등)
 * VideoProgressInfo — 재생 진행 정보 (현재 시간 / 총 길이 / 퍼센트)
 */

/** 비디오 재생 상태 */
export type VideoState =
  | 'idle'      // 초기 상태 (재생 전)
  | 'loading'   // 버퍼링 / 로딩 중
  | 'playing'   // 재생 중
  | 'paused'    // 일시정지
  | 'ended'     // 재생 완료
  | 'error';    // 오류 발생

/** 비디오 재생 진행 정보 */
export interface VideoProgressInfo {
  /** 현재 재생 시간 (초) */
  currentTime: number;
  /** 전체 영상 길이 (초, 메타데이터 로드 전에는 0) */
  duration: number;
  /** 재생 퍼센트 (0~100, duration이 0이면 0) */
  percent: number;
}

/** VideoPlayer 컴포넌트 props */
export interface VideoPlayerProps {
  /** 재생할 비디오 URL */
  src: string;
  /** 재생 진행 콜백 (1초마다 호출) */
  onProgress?: (info: VideoProgressInfo) => void;
  /** 재생 완료 콜백 */
  onEnded?: () => void;
  /** 에러 발생 콜백 */
  onError?: (message: string) => void;
  /** 영상 제목 (접근성 레이블용) */
  title?: string;
  /** 너비 (기본값: '100%') */
  width?: string;
  /** 높이 (기본값: 'auto') */
  height?: string;
  /** 자동 재생 여부 (기본값: false) */
  autoPlay?: boolean;
  /** 컨트롤 표시 여부 (기본값: true) */
  controls?: boolean;
}
