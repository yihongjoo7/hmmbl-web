'use client';

/**
 * features/shared/components/MapView/MapView.tsx
 *
 * 네이버/카카오 지도 통합 컴포넌트
 *
 * provider prop 하나로 지도 제공사를 전환할 수 있다.
 * 현재 위치 마커와 정확도 원(Circle)을 함께 표시한다.
 *
 * 사전 조건:
 *   네이버: app/[locale]/layout.tsx 등에서 Script 로드
 *     https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId={NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}
 *   카카오: //dapi.kakao.com/v2/maps/sdk.js?appkey={NEXT_PUBLIC_KAKAO_MAP_APP_KEY}&libraries=services&autoload=false
 *
 * 버그 수정 반영 (docs/11.브릿지구현.md §8 버그6):
 *   mapInstanceRef로 인스턴스를 저장하고, location 변경 시 기존 인스턴스를 파괴 후 재생성한다.
 */

import { useEffect, useRef } from 'react';
import type { GeoLocation } from '@/features/shared/hooks/useLocation';

type MapProvider = 'naver' | 'kakao';

interface MapViewProps {
  /** 표시할 위치 */
  location: GeoLocation;
  /** 지도 제공사 (기본값: 'naver') */
  provider?: MapProvider;
  /** 마커에 표시할 텍스트 */
  markerTitle?: string;
  /** 줌 레벨 (네이버: 1~21, 카카오: 1~14) */
  zoom?: number;
  width?: string;
  height?: string;
}

export function MapView({
  location,
  provider = 'naver',
  markerTitle = '현재 위치',
  zoom,
  width = '100%',
  height = '400px',
}: MapViewProps) {
  const containerRef   = useRef<HTMLDivElement>(null);
  // [버그6 수정] 지도 인스턴스를 ref로 저장해 cleanup 시 파괴한다.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // ── [버그6 수정] 이전 인스턴스 정리 ──────────────────────────────
    // location, provider 등이 변경될 때마다 이전 인스턴스를 파괴해야
    // 메모리 누수와 중복 마커 생성을 방지할 수 있다.
    if (mapInstanceRef.current) {
      try {
        // 네이버 지도: map.destroy() API 지원
        // 카카오 지도: destroy() 미지원 → innerHTML 초기화로 대체
        mapInstanceRef.current.destroy?.();
      } catch {
        // destroy 미지원 환경 — 컨테이너를 비워서 DOM 정리
      }
      mapInstanceRef.current = null;
      // 컨테이너 DOM 초기화 (카카오 지도 등 destroy 미지원 대비)
      if (containerRef.current) containerRef.current.innerHTML = '';
    }

    // ── 지도 초기화 ────────────────────────────────────────────────
    if (provider === 'naver') {
      mapInstanceRef.current = initNaverMap(
        containerRef.current,
        location,
        markerTitle,
        zoom ?? 16,
      );
    } else {
      mapInstanceRef.current = initKakaoMap(
        containerRef.current,
        location,
        markerTitle,
        zoom ?? 4,
      );
    }

    // ── cleanup: 컴포넌트 언마운트 시 인스턴스 파괴 ─────────────────
    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.destroy?.();
        } catch {
          // noop
        }
        mapInstanceRef.current = null;
      }
    };
  }, [location, provider, markerTitle, zoom]);

  return (
    <div
      ref={containerRef}
      style={{ width, height }}
      aria-label={`${markerTitle} 지도`}
    />
  );
}

// ── 네이버 지도 초기화 ────────────────────────────────────────────────

/**
 * 네이버 지도를 초기화하고 마커·정확도 원을 추가한다.
 * SDK: window.naver.maps 네임스페이스 사용
 * @returns 생성된 지도 인스턴스 (cleanup을 위해 반환)
 */
function initNaverMap(
  container: HTMLElement,
  location: GeoLocation,
  markerTitle: string,
  zoom: number,
): unknown {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const naver = (window as any).naver;
  if (!naver?.maps) {
    console.error('[MapView] 네이버 지도 SDK가 로드되지 않았습니다.');
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const maps = naver.maps as any;
  const center = new maps.LatLng(location.latitude, location.longitude);

  // 지도 인스턴스 생성
  const map = new maps.Map(container, {
    center,
    zoom,
    mapTypeId: maps.MapTypeId.NORMAL,
  });

  // 현재 위치 마커
  new maps.Marker({ position: center, map, title: markerTitle });

  // 정확도 원 (accuracy 반경을 Circle로 표현)
  new maps.Circle({
    map,
    center,
    radius:       location.accuracy,
    fillColor:    '#3b82f6',
    fillOpacity:  0.15,
    strokeColor:  '#3b82f6',
    strokeWeight: 1,
    strokeOpacity: 0.5,
  });

  return map;
}

// ── 카카오 지도 초기화 ────────────────────────────────────────────────

/**
 * 카카오 지도를 초기화하고 마커·정확도 원을 추가한다.
 * SDK: window.kakao.maps 네임스페이스 사용
 * @returns 생성된 지도 인스턴스 (cleanup을 위해 반환)
 */
function initKakaoMap(
  container: HTMLElement,
  location: GeoLocation,
  markerTitle: string,
  zoom: number,
): unknown {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const kakao = (window as any).kakao;
  if (!kakao?.maps) {
    console.error('[MapView] 카카오 지도 SDK가 로드되지 않았습니다.');
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const maps = kakao.maps as any;
  const latLng = new maps.LatLng(location.latitude, location.longitude);

  // 지도 인스턴스 생성 (level: 숫자가 클수록 넓은 범위)
  const map = new maps.Map(container, { center: latLng, level: zoom });

  // 마커 추가
  const marker = new maps.Marker({ position: latLng, map });

  // 인포윈도우(말풍선) 표시
  const infoWindow = new maps.InfoWindow({
    content: `<div style="padding:6px 12px;font-size:13px;">${markerTitle}</div>`,
  });
  infoWindow.open(map, marker);

  // 정확도 원
  new maps.Circle({
    map,
    center:       latLng,
    radius:       location.accuracy,
    strokeWeight: 1,
    strokeColor:  '#3b82f6',
    strokeOpacity: 0.8,
    fillColor:    '#3b82f6',
    fillOpacity:  0.15,
  });

  return map;
}
