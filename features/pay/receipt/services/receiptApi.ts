import { apiClient } from '@/lib/api/apiClient';
export const receiptApi = { list: () => apiClient.get('/pay/receipts'), detail: (id: string) => apiClient.get(`/pay/receipts/${id}`) };
export const receiptQueryKeys = { list: () => ['pay', 'receipt', 'list'] as const, detail: (id: string) => ['pay', 'receipt', id] as const };
