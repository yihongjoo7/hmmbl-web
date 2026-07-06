/**
 * ┌──────────────────────────────────────────────────────────────────┐
 * │  [개발자 레퍼런스]  types/index.ts                               │
 * │                                                                  │
 * │  역할 : 도메인 타입 정의                                         │
 * │  사용처: hooks/*.ts, services/*.ts, *View.tsx props              │
 * │                                                                  │
 * │  규칙                                                            │
 * │  ✅ 도메인 타입(ExampleItem 등)은 이 파일에서 정의               │
 * │  ✅ API 응답 래퍼 타입도 이 파일에서 정의                        │
 * │  ✅ View props 인터페이스는 View 파일 안에서 정의                 │
 * │     (작은 props 타입까지 여기 모을 필요 없음)                    │
 * │  ❌ React 타입 import 금지 (순수 타입 파일)                       │
 * └──────────────────────────────────────────────────────────────────┘
 */

// ─────────────────────────────────────────────────────────────────────────────
// 도메인 엔티티
// ─────────────────────────────────────────────────────────────────────────────

/** 아이템 1개 */
export interface ExampleItem {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  /** 배지 텍스트 ("NEW" | "HOT" | …). 없으면 undefined. */
  badge?: string;
  /** 좋아요 여부 */
  liked: boolean;
  /** 생성 일시 (ISO 8601) */
  createdAt: string;
}

/** 필터 옵션 1개 */
export interface FilterOption {
  id: string;
  label: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// API 응답 타입
//
// 서버 응답 구조에 맞춰 수정한다.
// 예시: { success: true, data: { items: [...] } } 형태라면
//       ExampleListResponse.data.items 로 접근
// ─────────────────────────────────────────────────────────────────────────────

/** 목록 API 응답 (단순 목록) */
export interface ExampleListResponse {
  items: ExampleItem[];
}

/** 목록 API 응답 (페이지네이션) */
export interface ExamplePagedResponse {
  items: ExampleItem[];
  /** 다음 페이지 번호. 마지막 페이지면 null. */
  nextPage: number | null;
  /** 전체 아이템 수 */
  total: number;
}

/** 상세 API 응답 */
export interface ExampleDetailResponse {
  item: ExampleItem;
  /** 연관 아이템 (있을 경우) */
  related?: ExampleItem[];
}
