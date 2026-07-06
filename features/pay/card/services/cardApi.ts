import { apiClient } from '@/lib/api/apiClient';
export const cardApi = { list: () => apiClient.get('/pay/cards'), register: (data: unknown) => apiClient.post('/pay/cards', data), delete: (id: string) => apiClient.delete(`/pay/cards/${id}`), setPrimary: (id: string) => apiClient.post(`/pay/cards/${id}/primary`) };
export const cardQueryKeys = { list: () => ['pay', 'card', 'list'] as const };
