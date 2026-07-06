import { apiClient } from '@/lib/api/apiClient';
export const subscriptionApi = { list: () => apiClient.get('/use/subscriptions'), subscribe: (id: string) => apiClient.post(`/use/subscriptions/${id}/subscribe`), cancel: (id: string) => apiClient.post(`/use/subscriptions/${id}/cancel`) };
export const subscriptionQueryKeys = { list: () => ['use', 'subscription', 'list'] as const };
