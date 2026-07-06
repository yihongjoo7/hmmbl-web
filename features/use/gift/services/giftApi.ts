import { apiClient } from '@/lib/api/apiClient';
export const giftApi = { send: (data: unknown) => apiClient.post('/use/gift/send', data) };
export const giftQueryKeys = { history: () => ['use', 'gift', 'history'] as const };
