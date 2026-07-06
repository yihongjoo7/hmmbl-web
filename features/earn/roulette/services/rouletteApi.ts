import { apiClient } from '@/lib/api/apiClient';
export const rouletteApi = { status: () => apiClient.get('/earn/roulette/status'), spin: () => apiClient.post('/earn/roulette/spin') };
export const rouletteQueryKeys = { status: () => ['earn', 'roulette', 'status'] as const };
