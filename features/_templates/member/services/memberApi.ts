// 원본: nextjs-new/features/member/services/memberApi.ts
// 변경: apiClient import 경로 @/services/apiClient → @/lib/api/apiClient (hpoint 구조)
import { apiClient } from '@/lib/api/apiClient';
import type { Member, MemberListParams, CreateMemberRequest, UpdateMemberRequest, ServerTimeResponse } from '../types';
import type { ApiListResponse, ApiResponse } from '@/types/api';

export const memberApi = {
  getList: (params?: MemberListParams) =>
    apiClient.get<ApiListResponse<Member>>('/members', params),
  getById: (id: string) =>
    apiClient.get<ApiResponse<Member>>(`/members/${id}`),
  create: (body: CreateMemberRequest) =>
    apiClient.post<ApiResponse<Member>>('/members', body),
  update: (id: string, body: UpdateMemberRequest) =>
    apiClient.post<ApiResponse<Member>>('/members/update', { id, ...body }),
  delete: (id: string) =>
    apiClient.post<void>('/members/delete', { id }),

  /**
   * 서버 현재 시각 조회 (인증 불필요 — 로그인·비로그인 모두 사용 가능)
   * 로그인 상태면 apiClient가 DPoP 헤더를 자동 주입하지만 백엔드는 검증하지 않는다.
   */
  getServerTime: () =>
    apiClient.get<ServerTimeResponse>('/members/server-time'),
};
