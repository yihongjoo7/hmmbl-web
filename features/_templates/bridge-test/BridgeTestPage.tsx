'use client';
/**
 * features/_templates/bridge-test/BridgeTestPage.tsx
 *
 * 테스트용 템플릿: nextjs-new 의 브릿지 테스트 화면
 *   (app/m/(protected)/advertisement/bridge-test/page.tsx)을 복사한 것.
 * 개발 허브(/dev) → /dev/bridge/full-test 라우트에서 렌더된다.
 *   (해당 라우트는 app/dev/bridge/layout.tsx 의 Mock 브릿지를 상속 → 네이티브 없이 동작)
 *
 * 변경점(원본 대비):
 *   1. import 경로 @/lib/env/* → @/lib/bridge/*
 *   2. StepCountResult / isStepCountError — hpoint lib/bridge 미제공이라 로컬 정의
 *   3. optional 메서드(hapticFeedback / openVideoPlayer)는 ?.() 로 호출
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { bridgeEventBus } from '@/lib/bridge/bridgeEventBus';
import type {
  CameraResult,
  GPSResult,
  VideoProgressEvent,
  VideoPlayerClosedEvent,
} from '@/lib/bridge/bridge';
import { Button } from '@/components/common/ui/action/Button';

// ── 걸음수 타입/가드 (로컬 정의 — hpoint lib/bridge 미제공) ──────────────────
/** 걸음수 조회 성공 결과 (네이티브 → 웹) */
interface StepCountResult {
  /** 해당 날짜의 총 걸음수 (0 이상 정수) */
  steps: number;
  /** 조회 기준 날짜 ("YYYY-MM-DD" 형식) */
  date: string;
}
/** 걸음수 조회 실패 결과 — 권한 거부, Health Connect 미설치 등 */
interface StepCountErrorResult {
  error: string;
}
type StepCountResultOrError = StepCountResult | StepCountErrorResult;
function isStepCountError(v: StepCountResultOrError): v is StepCountErrorResult {
  return 'error' in v;
}

// Big Buck Bunny 10s 1MB — CC 라이선스, 테스트 전용
// 출처: https://test-videos.co.uk
// 백엔드 URI 기능 완성 후 TEST_VIDEO_URL 상수만 교체하면 됨
// const TEST_VIDEO_URL =
//   'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4';
const TEST_VIDEO_URL =
  'https://www.w3schools.com/html/mov_bbb.mp4';

const TEST_VIDEO_ID = 'bridge-test-video';
const MAX_LOGS = 50;

type LogEntry = {
  time: string;
  label: string;
  success: boolean;
  data: unknown;
};

function timestamp(): string {
  return new Date().toLocaleTimeString('ko-KR', { hour12: false });
}

export default function BridgeTestPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [cameraImage, setCameraImage] = useState<CameraResult | null>(null);
  const [galleryImage, setGalleryImage] = useState<CameraResult | null>(null);
  const [gpsResult, setGpsResult] = useState<GPSResult | null>(null);
  const [stepResult, setStepResult] = useState<StepCountResult | null>(null);
  const [videoVisible, setVideoVisible] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const lastLogPctRef = useRef<number>(-1);

  const addLog = useCallback((label: string, success: boolean, data: unknown) => {
    setLogs((prev) => [
      { time: timestamp(), label, success, data },
      ...prev.slice(0, MAX_LOGS - 1),
    ]);
  }, []);

  // 브릿지 이벤트 구독
  useEffect(() => {
    const unsubs = [
      bridgeEventBus.on<CameraResult | { error: string }>('cameraResult', (data) => {
        const isError = 'error' in (data as object);
        if (isError) {
          const { error } = data as { error: string };
          // [40번 v1.4] 모든 에러를 "권한 없음"으로 표시하던 것을 코드별 메시지로 교정
          // (실제 에러 원인 추적을 오도했음 — 카메라/Photo Picker 는 권한 자체가 불필요)
          const msg =
            error === 'CAMERA_UNAVAILABLE' ? '카메라를 사용할 수 없습니다. 기기 상태를 확인해주세요.' :
            error === 'DECODE_FAILED'      ? '이미지를 읽을 수 없습니다. 다른 사진으로 시도해주세요.' :
            error === 'USER_CANCELLED'     ? null :
            `카메라 오류: ${error}`;
          if (msg) window.bridge?.showNativeToast(msg);
          addLog('카메라 촬영', false, data);
        } else {
          setCameraImage(data as CameraResult);
          addLog('카메라 촬영', true, data);
        }
      }),
      bridgeEventBus.on<CameraResult | { error: string }>('galleryResult', (data) => {
        const isError = 'error' in (data as object);
        if (isError) {
          const { error } = data as { error: string };
          const msg =
            error === 'DECODE_FAILED'  ? '이미지를 읽을 수 없습니다. 다른 사진으로 시도해주세요.' :
            error === 'USER_CANCELLED' ? null :
            `갤러리 오류: ${error}`;
          if (msg) window.bridge?.showNativeToast(msg);
          addLog('갤러리 선택', false, data);
        } else {
          setGalleryImage(data as CameraResult);
          addLog('갤러리 선택', true, data);
        }
      }),
      bridgeEventBus.on<GPSResult | { error: string }>('gpsResult', (data) => {
        const isError = 'error' in (data as object);
        if (!isError) {
          setGpsResult(data as GPSResult);
          addLog('GPS 확인', true, data);
        } else {
          const { error } = data as { error: string };
          const msg =
            error === 'PERMISSION_DENIED' ? 'GPS 권한이 없습니다. 설정에서 허용해주세요.' :
            error === 'GPS_DISABLED'      ? 'GPS가 꺼져 있습니다. 위치 서비스를 활성화해주세요.' :
            error === 'TIMEOUT'           ? '위치를 가져오지 못했습니다. 다시 시도해주세요.' :
            null;
          if (msg) window.bridge?.showNativeToast(msg);
          addLog('GPS 확인', false, data);
        }
      }),
      // 걸음수 결과 (B-02: 성공/실패 모두 stepCountResult 이벤트로 전달)
      // isStepCountError() 타입 가드로 분기. steps: 0 은 0보행으로 정상 성공.
      bridgeEventBus.on<StepCountResult | { error: string }>('stepCountResult', (data) => {
        if (isStepCountError(data)) {
          const { error } = data;
          const msg =
            error === 'HEALTH_PERMISSION_DENIED' ? '건강 데이터 권한이 없습니다. 설정에서 허용해주세요.' :
            error === 'HEALTH_NOT_AVAILABLE'      ? 'Health Connect를 사용할 수 없습니다.' :
            error === 'HEALTH_DATA_UNAVAILABLE'   ? '해당 날짜의 걸음수 데이터가 없습니다.' :
            null;
          if (msg) window.bridge?.showNativeToast(msg);
          addLog('걸음수 조회', false, data);
        } else {
          setStepResult(data as StepCountResult);
          addLog('걸음수 조회', true, data);
        }
      }),
      bridgeEventBus.on<{ success: boolean; error?: string }>('biometricResult', (data) => {
        addLog('생체인증', data.success, data);
        if (!data.success) {
          // 생체인증 실패 시 PIN 자동 요청
          window.bridge?.requestPin();
          addLog('PIN 요청 (생체인증 실패)', true, null);
        }
      }),
      bridgeEventBus.on<{ success: boolean; error?: string }>('pinResult', (data) => {
        // [38번 C-6] 신규 에러 코드 매핑 (PIN_NOT_REGISTERED / PIN_LOCKED / TIMEOUT)
        const pinErrorDesc: Record<string, string> = {
          USER_CANCELLED:     '사용자 취소',
          PIN_NOT_REGISTERED: 'PIN 미등록 — 설정에서 등록 필요',
          PIN_LOCKED:         '연속 실패 잠금 — 잠시 후 재시도',
          TIMEOUT:            '입력 시간 초과',
          NOT_SUPPORTED:      '기능 미지원',
        };
        const suffix = data.error ? ` (${pinErrorDesc[data.error] ?? data.error})` : '';
        addLog('PIN 인증' + suffix, data.success, data);
      }),
      bridgeEventBus.on<VideoProgressEvent>('videoProgress', (data) => {
        addLog(
          `동영상 진행 ${Math.round(data.percentage * 100)}%`,
          true,
          data,
        );
      }),
      bridgeEventBus.on<VideoPlayerClosedEvent>('videoPlayerClosed', (data) => {
        addLog('동영상 플레이어 종료', true, data);
      }),
    ];

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, [addLog]);

  // 소형 플레이어 재생 시작
  const handleVideoPlay = useCallback(() => {
    setVideoVisible(true);
    lastLogPctRef.current = -1;
    setTimeout(() => {
      videoRef.current?.play().catch(() => {
        // autoplay 정책으로 실패할 수 있음 — 사용자 인터랙션 필요
      });
    }, 100);
  }, []);

  // timeupdate: 1% 단위로만 로그 기록 (과다 출력 방지)
  const handleVideoTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const pct = Math.floor((video.currentTime / video.duration) * 100);
    if (pct !== lastLogPctRef.current) {
      lastLogPctRef.current = pct;
      addLog(`동영상 재생 ${pct}%`, true, {
        currentTime: video.currentTime.toFixed(1),
        duration: video.duration.toFixed(1),
        percentage: pct,
      });
    }
  }, [addLog]);

  // 커스텀 전체화면 버튼 → 네이티브 전체화면 이어보기
  const handleVideoFullscreen = useCallback(() => {
    const currentTime = videoRef.current?.currentTime ?? 0;
    window.bridge?.openVideoPlayer?.(TEST_VIDEO_URL, TEST_VIDEO_ID, currentTime);
    addLog('전체화면 요청', true, {
      url: TEST_VIDEO_URL,
      videoId: TEST_VIDEO_ID,
      startPosition: currentTime,
    });
  }, [addLog]);

  return (
    <main className="p-4 space-y-6">
      <h1 className="text-lg font-bold text-text-primary">브릿지 테스트</h1>

      {/* ── 버튼 영역 ── */}
      <section className="space-y-4">
        {/* 미디어 */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">미디어</p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.bridge?.requestCamera()}
            >
              카메라 촬영
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.bridge?.requestGallery()}
            >
              갤러리 선택
            </Button>
          </div>
        </div>

        {/* 동영상 */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">동영상</p>
          <Button variant="outline" size="sm" onClick={handleVideoPlay}>
            소형 플레이어 재생
          </Button>
        </div>

        {/* 위치 */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">위치</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.bridge?.requestGPS()}
          >
            GPS 확인
          </Button>
        </div>

        {/* 하드웨어 */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">하드웨어</p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.bridge?.hapticFeedback?.('light')}
            >
              진동 약
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.bridge?.hapticFeedback?.('medium')}
            >
              진동 중
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.bridge?.hapticFeedback?.('heavy')}
            >
              진동 강
            </Button>
          </div>
        </div>

        {/* 보안 */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">보안</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.bridge?.requestBiometric()}
          >
            생체인증
          </Button>
        </div>

        {/* 걸음 */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">걸음</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.bridge?.requestStepCount('')}
          >
            오늘 걸음수
          </Button>
        </div>
      </section>

      {/* ── 결과 표시 영역 ── */}
      <section className="space-y-4">
        {/* 카메라 결과 */}
        {cameraImage && (
          <div>
            <p className="text-xs font-semibold text-text-secondary mb-1">카메라 결과</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`data:${cameraImage.mimeType};base64,${cameraImage.base64}`}
              alt="카메라 촬영 결과"
              className="max-w-full rounded-lg border border-border-default"
              style={{ maxHeight: 240 }}
            />
          </div>
        )}

        {/* 갤러리 결과 */}
        {galleryImage && (
          <div>
            <p className="text-xs font-semibold text-text-secondary mb-1">갤러리 선택 결과</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`data:${galleryImage.mimeType};base64,${galleryImage.base64}`}
              alt="갤러리 선택 결과"
              className="max-w-full rounded-lg border border-border-default"
              style={{ maxHeight: 240 }}
            />
          </div>
        )}

        {/* 동영상 소형 플레이어 */}
        {videoVisible && (
          <div>
            <p className="text-xs font-semibold text-text-secondary mb-1">동영상</p>
            <div className="relative rounded-lg overflow-hidden bg-black">
              {/* controlsList="nofullscreen": HTML5 기본 전체화면 버튼 숨김 */}
              <video
                ref={videoRef}
                src={TEST_VIDEO_URL}
                controls
                controlsList="nofullscreen"
                playsInline
                className="w-full"
                style={{ maxHeight: 220 }}
                onTimeUpdate={handleVideoTimeUpdate}
              />
              {/* 커스텀 전체화면 버튼 — 네이티브 플레이어로 이어보기 */}
              <button
                type="button"
                onClick={handleVideoFullscreen}
                className="absolute bottom-10 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded"
              >
                전체화면
              </button>
            </div>
          </div>
        )}

        {/* GPS 지도 */}
        {gpsResult && (
          <div>
            <p className="text-xs font-semibold text-text-secondary mb-1">
              GPS 위치 ({gpsResult.latitude.toFixed(5)}, {gpsResult.longitude.toFixed(5)})
            </p>
            <iframe
              title="GPS 위치 지도"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${gpsResult.longitude - 0.005},${gpsResult.latitude - 0.005},${gpsResult.longitude + 0.005},${gpsResult.latitude + 0.005}&layer=mapnik&marker=${gpsResult.latitude},${gpsResult.longitude}`}
              className="w-full rounded-lg border border-border-default"
              style={{ height: 200 }}
            />
          </div>
        )}

        {/* 걸음수 결과 */}
        {stepResult && (
          <div>
            <p className="text-xs font-semibold text-text-secondary mb-1">
              걸음수 — {stepResult.date}
            </p>
            <p className="text-2xl font-bold text-text-primary">
              {stepResult.steps.toLocaleString()} 보
            </p>
          </div>
        )}
      </section>

      {/* ── 로그 패널 ── */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">로그</p>
          <button
            type="button"
            onClick={() => setLogs([])}
            className="text-xs text-text-disabled hover:text-text-secondary"
          >
            초기화
          </button>
        </div>
        <div className="rounded-lg border border-border-default bg-bg-secondary overflow-y-auto" style={{ maxHeight: 280 }}>
          {logs.length === 0 ? (
            <p className="p-4 text-xs text-text-disabled text-center">버튼을 터치하면 결과가 여기에 표시됩니다.</p>
          ) : (
            <ul className="divide-y divide-border-subtle">
              {logs.map((log, i) => (
                <li key={i} className="px-3 py-2">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className={`text-xs font-semibold ${log.success ? 'text-success' : 'text-error'}`}
                    >
                      {log.success ? '✓' : '✗'} {log.label}
                    </span>
                    <span className="text-xs text-text-disabled ml-auto">{log.time}</span>
                  </div>
                  {log.data !== null && (
                    <pre className="text-xs text-text-secondary whitespace-pre-wrap break-all">
                      {JSON.stringify(log.data, null, 2)}
                    </pre>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
