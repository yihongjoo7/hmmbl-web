import { apiClient } from '@/lib/api/apiClient';
export const affiliateMapApi = { list: (filter: string) => apiClient.get('/use/affiliates', { filter }), detail: (id: string) => apiClient.get(`/use/affiliates/${id}`) };
export const affiliateMapQueryKeys = { list: (f: string) => ['use', 'affiliate-map', 'list', f] as const };
