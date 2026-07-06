/**
 * ┌──────────────────────────────────────────────────────────────────┐
 * │  [개발자 레퍼런스]  services/exampleApi.ts                       │
 * │                                                                  │
 * │  역할 : API 엔드포인트 정의 (서버 통신 전담)                     │
 * │  사용처: hooks/*.ts 에서만 호출                                  │
 * │                                                                  │
 * │  규칙                                                            │
 * │  ✅ apiClient 를 통해서만 요청                                   │
 * │  ✅ 반환 타입 명시 (any 금지)                                    │
 * │  ✅ 엔드포인트 경로는 상수로 관리 (오타 방지)                    │
 * │  ❌ React / 훅 import 금지 (순수 함수 모듈)                      │
 * │  ❌ UI 상태(로딩, 에러 메시지 등) 관리 금지                      │
 * └──────────────────────────────────────────────────────────────────┘
 */

import { apiClient } from '@/lib/api/apiClient';
import type {
  ExampleItem,
  ExampleListResponse,
  ExampleDetailResponse,
  ExamplePagedResponse,
} from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// 엔드포인트 경로 상수
// 경로가 변경될 때 이 곳만 수정하면 된다.
// ─────────────────────────────────────────────────────────────────────────────

const API = {
  LIST:          '/example',
  DETAIL:        (id: string) => `/example/${id}`,
  LIKE:          (id: string) => `/example/${id}/like`,
  DELETE_BY_ID:  (id: string) => `/example/${id}/delete`,
  CREATE:        '/example',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// API 함수 모음
// ─────────────────────────────────────────────────────────────────────────────

export const exampleApi = {

  /**
   * 목록 조회 (필터 적용)
   *
   * GET /example?filter=food
   *
   * @param params.filter - 필터 id ('all' | 'food' | 'culture' | ...)
   */
  list: (params: { filter?: string } = {}) =>
    apiClient.get<ExampleListResponse>(API.LIST, params),

  /**
   * 페이지네이션 목록 조회 (무한 스크롤용)
   *
   * GET /example?filter=food&page=2
   */
  listPaged: (params: { filter?: string; page?: number } = {}) =>
    apiClient.get<ExamplePagedResponse>(API.LIST, params),

  /**
   * 상세 단건 조회
   *
   * GET /example/:id
   */
  detail: (id: string) =>
    apiClient.get<ExampleDetailResponse>(API.DETAIL(id)),

  /**
   * 좋아요 토글
   *
   * POST /example/:id/like
   *
   * 서버가 현재 좋아요 상태를 반환하면 반환 타입에 명시:
   * apiClient.post<{ liked: boolean }>(...)
   */
  like: (id: string) =>
    apiClient.post<void>(API.LIKE(id)),

  /**
   * 삭제 (POST 방식)
   *
   * POST /example/:id/delete
   *
   * 이 프로젝트는 DELETE 메서드를 사용하지 않는다.
   * 삭제 요청은 POST /…/delete 엔드포인트로 처리한다.
   */
  deleteById: (id: string) =>
    apiClient.post<void>(API.DELETE_BY_ID(id)),

  /**
   * 생성
   *
   * POST /example
   *
   * @param payload - 요청 바디
   */
  create: (payload: { title: string; content: string }) =>
    apiClient.post<ExampleItem>(API.CREATE, payload),
};
