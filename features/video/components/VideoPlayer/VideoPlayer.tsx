'use client';

/**
 * features/video/components/VideoPlayer/VideoPlayer.tsx
 *
 * HTML5 비디오 플레이어 컴포넌트
 *
 * 버그 수정 반영 (docs/11.브릿지구현.md §8 버그3+7):
 *   - duration을 useState로 관리 (useVideoProgress 훅 내부에서 처리)
 *   - onLoadedMetadata에서만 duration 추출, timeupdate는 상태값 참조
 *
 * 기능:
 *   - HTML5 <video> 기반 재생 (웹/웹뷰 공통)
 *   - 재생 진행 콜백 (onProgress), 완료/에러 콜백 지원
 *   - 로딩/에러 오버레이 표시
 *   - 접근성: aria-label, role="status" 적용
 *
 * 사용법:
 *   <VideoPlayer
 *     src="https://example.com/video.mp4"
 *     title="소개 영상"
 *     onProgress={(info) => console.log(info.percent + '%')}
 *     onEnded={() => console.log('재생 완료')}
 *   />
 */

import { useVideoProgress } from '@/features/video/hooks/useVideoProgress';
import type { VideoPlayerProps } from '@/features/video/types/video';
import styles from './VideoPlayer.module.css';

export function VideoPlayer({
  src,
  onProgress,
  onEnded,
  onError,
  title    = '비디오',
  width    = '100%',
  height   = 'auto',
  autoPlay = false,
  controls = true,
}: VideoPlayerProps) {
  const { videoRef, videoState, progress, bindEvents } = useVideoProgress({
    onProgress,
    onEnded,
    onError,
  });

  // 로딩 중 여부
  const isLoading = videoState === 'loading' || videoState === 'idle';
  // 에러 여부
  const isError   = videoState === 'error';

  return (
    <div className={styles.wrapper} style={{ width }}>
      {/* ── 비디오 엘리먼트 ── */}
      <video
        ref={videoRef}
        src={src}
        width="100%"
        height={height}
        autoPlay={autoPlay}
        controls={controls}
        playsInline       // iOS Safari: 인라인 재생 허용
        preload="metadata" // 메타데이터(duration)만 선로드
        aria-label={title}
        className={styles.video}
        // [버그3+7 수정] bindEvents에 포함된 onLoadedMetadata로
        // duration을 안전하게 추출한다. timeupdate는 상태값 참조.
        {...bindEvents}
      />

      {/* ── 버퍼링 오버레이 ── */}
      {isLoading && videoState === 'loading' && (
        <div className={styles.overlay} role="status" aria-label="로딩 중">
          <span className={styles.spinner} aria-hidden="true" />
          <span>로딩 중...</span>
        </div>
      )}

      {/* ── 에러 오버레이 ── */}
      {isError && (
        <div className={`${styles.overlay} ${styles.errorOverlay}`} role="alert">
          <span aria-hidden="true">⚠️</span>
          <span>영상을 재생할 수 없습니다.</span>
        </div>
      )}

      {/* ── 재생 진행 정보 (controls=false일 때 자체 표시) ── */}
      {!controls && !isError && progress.duration > 0 && (
        <div className={styles.progressBar} aria-hidden="true">
          <div
            className={styles.progressFill}
            style={{ width: `${progress.percent}%` }}
          />
        </div>
      )}
    </div>
  );
}
