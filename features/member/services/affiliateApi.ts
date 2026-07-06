// 계열사 API
import { apiClient } from '@/lib/api/apiClient';

export interface Affiliate {
  id: string;
  name: string;
  isConnected: boolean;
}

export const affiliateApi = {
  list:       () => apiClient.get<{ affiliates: Affiliate[] }>('/member/affiliates'),
  connect:    (id: string) => apiClient.post(`/member/affiliates/${id}/connect`),
  disconnect: (id: string) => apiClient.post(`/member/affiliates/${id}/disconnect`),
};
