import { apiClient } from '@/lib/api/apiClient';
export const productApi = { list: () => apiClient.get('/use/products'), detail: (id: string) => apiClient.get(`/use/products/${id}`), purchase: (id: string) => apiClient.post(`/use/products/${id}/purchase`) };
export const productQueryKeys = { list: () => ['use', 'product', 'list'] as const, detail: (id: string) => ['use', 'product', id] as const };
