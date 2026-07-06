import { apiClient } from '@/lib/api/apiClient';
export const donationApi = { list: () => apiClient.get('/use/donations'), detail: (id: string) => apiClient.get(`/use/donations/${id}`), donate: (id: string, amount: number) => apiClient.post(`/use/donations/${id}/donate`, { amount }), my: () => apiClient.get('/use/donations/my') };
export const donationQueryKeys = { list: () => ['use', 'donation', 'list'] as const, detail: (id: string) => ['use', 'donation', id] as const, my: () => ['use', 'donation', 'my'] as const };
