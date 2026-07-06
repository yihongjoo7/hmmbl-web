import { apiClient } from '@/lib/api/apiClient';
export const couponApi = { list: (filter: string) => apiClient.get('/earn/coupons', { filter }), detail: (id: string) => apiClient.get(`/earn/coupons/${id}`), use: (id: string) => apiClient.post(`/earn/coupons/${id}/use`) };
