'use client';

/**
 * features/video/hooks/useVideoProgress.ts
 *
 * HTML5 <video> 재생 진행 상태 훅
 *
 * 버그 수정 반영 (docs/11.브릿지구현.md §8 버그3+7):
 *   - duration을 videoRef.current.duration에서 직접 읽지 않는다.
 *   - onLoadedMetadata 이벤트에서 duration 상태를 별도로 저장하고
 *     timeupdate 핸들러는 저장된 상태값을 참조한다.
 *   - 이유: timeupdate 실행 시점에 duration이 NaN일 수 있기 때문.
 *
 * 기능:
 *   - 1초마다 진행 정보(currentTime, duration, percent) 콜백 호출
 *   - videoState(idle/loading/playing/paused/ended/error) 관리
 *   - videoRef를 통해 외부에서 직접 제어 가능
 *
 * 사용법:
 *   const { videoRef, videoState, progress, bindEvents } = useVideoProgress({ onProgress });
 *   return <video ref={videoRef} {...bindEvents} />;
 */

import { useRef, useState, useCallback, useEffect } from 'react';
import type { VideoState, VideoProgressInfo } from '@/features/video/types/video';

interface UseVideoProgressOptions {
  /** 재생 진행 콜백 (1초마다 호출) */
  onProgress?: (info: VideoProgressInfo) => void;
  /** 재생 완료 콜백 */
  onEnded?: () => void;
  /** 에러 콜백 */
  onError?: (message: string) => void;
}

interface UseVideoProgressReturn {
  /** video 엘리먼트에 연결할 ref */
  videoRef: React.RefObject<HTMLVideoElement>;
  /** 현재 재생 상태 */
  videoState: VideoState;
  /** 현재 진행 정보 */
  progress: VideoProgressInfo;
  /** video 엘리먼트에 spread할 이벤트 핸들러 모음 */
  bindEvents: {
    onLoadedMetadata: () => void;
    onTimeUpdate:     () => void;
    onPlay:           () => void;
    onPause:          () => void;
    onEnded:          () => void;
    onError:          () => void;
    onWaiting:        () => void;
  };
}

export function useVideoProgress({
  onProgress,
  onEnded: onEndedProp,
  onError: onErrorProp,
}: UseVideoProgressOptions = {}): UseVideoProgressReturn {

  // [타입 수정] HTMLVideoElement로 지정해야 <video ref={...}> 에 할당 가능하다.
  const videoRef = useRef<HTMLVideoElement>(null);

  // [버그3+7 수정] duration을 useState로 관리한다.
  // videoRef.current.duration을 timeupdate 핸들러에서 직접 읽으면
  // 메타데이터가 아직 로드되지 않아 NaN이 반환될 수 있다.
  const [duration, setDuration] = useState(0);

  const [videoState, setVideoState] = useState<VideoState>('idle');
  const [progress,   setProgress  ] = useState<VideoProgressInfo>({
    currentTime: 0,
    duration:    0,
    percent:     0,
  });

  // 마지막으로 콜백을 호출한 초(초 단위 비교용)
  const lastReportedSecRef = useRef<number>(-1);

  // ── 이벤트 핸들러 ──────────────────────────────────────────────────────────

  /**
   * onLoadedMetadata: 메타데이터 로드 완료 시 duration을 상태에 저장한다.
   * [버그3+7 수정] 이 핸들러에서만 duration을 읽어 상태로 저장한다.
   */
  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    // 메타데이터 로드 완료 → duration이 유효한 숫자로 확정된 시점
    const loadedDuration = isFinite(video.duration) ? video.duration : 0;
    setDuration(loadedDuration);
    setVideoState('idle');
  }, []);

  /**
   * onTimeUpdate: 재생 시간 변경 시 진행 상태 업데이트.
   * [버그3+7 수정] duration은 useState에서 가져온 값을 사용한다.
   * 1초 단위로만 onProgress 콜백을 호출해 과도한 호출을 방지한다.
   */
  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const currentTime = video.currentTime;

    // [버그3+7 수정] duration을 ref/DOM에서 직접 읽지 않고 상태값 사용
    // (duration은 onLoadedMetadata에서 상태로 저장된 값)
    const percent = duration > 0 ? (currentTime / duration) * 100 : 0;

    const newProgress: VideoProgressInfo = {
      currentTime: Math.floor(currentTime),
      duration:    Math.floor(duration),
      percent:     Math.round(percent * 10) / 10, // 소수점 1자리
    };

    setProgress(newProgress);

    // 1초마다 onProgress 콜백 호출 (매 timeupdate마다 호출하면 과부하)
    const currentSec = Math.floor(currentTime);
    if (currentSec !== lastReportedSecRef.current) {
      lastReportedSecRef.current = currentSec;
      onProgress?.(newProgress);
    }
  }, [duration, onProgress]); // duration 상태에 의존

  const handlePlay    = useCallback(() => setVideoState('playing'), []);
  const handlePause   = useCallback(() => setVideoState('paused'),  []);
  const handleWaiting = useCallback(() => setVideoState('loading'), []);

  const handleEnded = useCallback(() => {
    setVideoState('ended');
    onEndedProp?.();
  }, [onEndedProp]);

  const handleError = useCallback(() => {
    const video = videoRef.current;
    // MediaError 코드를 한국어 메시지로 변환
    const code = video?.error?.code;
    const message = buildMediaErrorMessage(code);
    setVideoState('error');
    onErrorProp?.(message);
  }, [onErrorProp]);

  // ── 언마운트 시 정리 ────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      // 컴포넌트 언마운트 시 타이머/상태 정리
      lastReportedSecRef.current = -1;
    };
  }, []);

  return {
    videoRef,
    videoState,
    progress,
    bindEvents: {
      onLoadedMetadata: handleLoadedMetadata,
      onTimeUpdate:     handleTimeUpdate,
      onPlay:           handlePlay,
      onPause:          handlePause,
      onEnded:          handleEnded,
      onError:          handleError,
      onWaiting:        handleWaiting,
    },
  };
}

// ── 헬퍼 ──────────────────────────────────────────────────────────────────────

/**
 * MediaError 코드를 한국어 메시지로 변환한다.
 * https://developer.mozilla.org/en-US/docs/Web/API/MediaError/code
 */
function buildMediaErrorMessage(code: number | undefined): string {
  switch (code) {
    case 1: return '재생이 취소되었습니다.';
    case 2: return '네트워크 오류로 재생할 수 없습니다.';
    case 3: return '미디어 디코딩에 실패했습니다.';
    case 4: return '지원하지 않는 미디어 형식입니다.';
    default: return '알 수 없는 오류로 재생에 실패했습니다.';
  }
}
