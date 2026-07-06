import { apiClient } from '@/lib/api/apiClient';
export const directEarnApi = { submit: (data: unknown) => apiClient.post('/pay/direct-earn', data) };
export const directEarnQueryKeys = {};
