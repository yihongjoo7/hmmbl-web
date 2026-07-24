/**
 * lib/bridge/appVersion.ts
 *
 * 네이티브 앱 버전 캐싱 및 비교 유틸
 *
 * 원본: nextjs-new/lib/env/appVersion.ts
 * 이전 변경: import 경로 `'./bridgeEventBus'` → `'./bridgeClient'`
 *
 * 신규 브릿지 메서드를 사용하기 전에 앱 버전을 확인해
 * 구버전 앱에서 미지원 메서드를 호출하는 것을 방지한다.
 *
 * 사용법:
 *   import { isVersionAtLeast } from '@/lib/bridge/appVersion';
 *
 *   if (await isVersionAtLeast('1.1.0')) {
 *     showNativeToast(message);  // 1.1.0 이상에서만 지원
 *   } else {
 *     // 웹 토스트 폴백
 *   }
 */

import { bridgeEventBus } from './bridgeClient';

// ── 타입 ──────────────────────────────────────────────────────────────────

/** 파싱된 앱 버전 (semver 3자리) */
interface ParsedVersion {
  major: number;
  minor: number;
  patch: number;
}

// ── 버전 캐시 ───────────────────────────────────────────────────────────────

/**
 * 앱 버전 캐시.
 * 한 세션에서 한 번만 네이티브에 조회하고 이후에는 캐시를 반환한다.
 */
let cachedVersion: ParsedVersion | null = null;

// ── 함수 ──────────────────────────────────────────────────────────────────

/**
 * 네이티브 앱 버전을 가져온다 (캐싱 적용).
 *
 * - bridge 없는 환경(웹 브라우저)에서는 null을 반환한다.
 * - 5초 이내 응답 없으면 null을 반환한다 (구버전 앱 또는 미지원).
 *
 * @returns 파싱된 버전 객체 또는 null
 */
export async function getAppVersion(): Promise<ParsedVersion | null> {
  // 웹뷰 환경이 아니면 버전 정보 없음
  if (!window.bridge) return null;

  // 캐시 히트: 이미 조회한 버전이 있으면 재사용
  if (cachedVersion) return cachedVersion;

  const TIMEOUT_MS = 5_000;

  return new Promise((resolve) => {
    // 5초 내 응답 없으면 null 반환 (구버전 앱 또는 미지원)
    const timer = setTimeout(() => {
      unsubscribe();
      console.warn('[appVersion] 앱 버전 조회 타임아웃 — null 반환');
      resolve(null);
    }, TIMEOUT_MS);

    const unsubscribe = bridgeEventBus.once<{ version: string; buildNumber: string }>(
      'appVersion',
      ({ version }) => {
        clearTimeout(timer);
        // '1.2.3' → { major: 1, minor: 2, patch: 3 }
        const [major, minor, patch] = version.split('.').map(Number);
        cachedVersion = { major, minor, patch };
        resolve(cachedVersion);
      },
    );

    // 요청 전송
    window.bridge!.getAppVersion();
  });
}

/**
 * 현재 앱 버전이 지정된 최소 버전 이상인지 확인한다.
 *
 * - bridge 없는 환경에서는 false를 반환한다.
 * - 버전 조회 실패(타임아웃 등) 시 false를 반환한다.
 *
 * @param minVersion '1.2.0' 형식의 최소 버전 문자열
 * @returns 최소 버전 이상이면 true
 *
 * @example
 *   // showNativeToast는 1.1.0 이상에서만 지원
 *   if (await isVersionAtLeast('1.1.0')) {
 *     showNativeToast('저장되었습니다.');
 *   }
 */
export async function isVersionAtLeast(minVersion: string): Promise<boolean> {
  const version = await getAppVersion();
  if (!version) return false;

  const [minMajor, minMinor, minPatch] = minVersion.split('.').map(Number);

  // major 우선 비교
  if (version.major !== minMajor) return version.major > minMajor;
  // minor 비교
  if (version.minor !== minMinor) return version.minor > minMinor;
  // patch 비교
  return version.patch >= minPatch;
}

/**
 * 앱 버전 캐시를 초기화한다.
 * 테스트 환경에서 캐시를 비워야 할 때 사용한다.
 * 프로덕션 코드에서는 사용하지 않는다.
 */
export function resetVersionCache(): void {
  cachedVersion = null;
}
