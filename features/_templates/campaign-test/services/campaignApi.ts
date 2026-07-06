// 원본: nextjs-new/features/campaign/services/campaignApi.ts (getOrderList만 발췌)
// 변경: apiClient import 경로 @/services/apiClient → @/lib/api/apiClient (hpoint 구조)
import { apiClient } from '@/lib/api/apiClient';
import type { OrderListRequest, OrderListResponse } from '../types';

export const campaignApi = {
  // 주문 목록 조회 — POST /biz/order/order-list
  // 백엔드가 ApiResponse 래퍼 없이 OrderListResponse 직접 반환
  // DPoP 인증은 apiClient 내부에서 자동 처리
  getOrderList: (body: OrderListRequest) =>
    apiClient.post<OrderListResponse>('/biz/order/order-list', body),
};
