import { apiClient } from '@/lib/api/apiClient';
export const transferApi = { transfer: (data: { partnerId: string; amount: number }) => apiClient.post('/pay/transfer', data), history: () => apiClient.get('/pay/transfer/history'), partners: () => apiClient.get('/pay/transfer/partners') };
export const transferQueryKeys = { history: () => ['pay', 'transfer', 'history'] as const, partners: () => ['pay', 'transfer', 'partners'] as const };
