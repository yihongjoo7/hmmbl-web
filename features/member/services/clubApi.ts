// 클럽 API
import { apiClient } from '@/lib/api/apiClient';

export interface Club {
  id: string;
  name: string;
  isJoined: boolean;
  benefit: string;
}

export interface ClubSubscription {
  isSubscribed: boolean;
  nextBillingDate?: string;
}

export const clubApi = {
  list:            () => apiClient.get<{ clubs: Club[] }>('/member/clubs'),
  join:            (id: string) => apiClient.post(`/member/clubs/${id}/join`),
  getSubscription: (id: string) => apiClient.get<ClubSubscription>(`/member/clubs/${id}/subscription`),
  subscribe:       (id: string) => apiClient.post(`/member/clubs/${id}/subscribe`),
  unsubscribe:     (id: string) => apiClient.post(`/member/clubs/${id}/unsubscribe`),
};
