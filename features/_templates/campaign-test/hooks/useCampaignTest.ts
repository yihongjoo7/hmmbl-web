// 원본: nextjs-new/features/campaign/hooks/useCampaignTest.ts (그대로, 상대경로만 조정)
import { useMutation } from '@tanstack/react-query';
import { campaignApi } from '../services/campaignApi';
import type { OrderListRequest } from '../types';

export function useCampaignTest() {
  return useMutation({
    mutationFn: (body: OrderListRequest) => campaignApi.getOrderList(body),
  });
}
