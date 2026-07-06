import { apiClient } from '@/lib/api/apiClient';
export const brandPaymentApi = { merchants: () => apiClient.get('/pay/brand-payment/merchants'), requestBarcode: () => apiClient.post('/pay/brand-payment/barcode') };
export const brandPaymentQueryKeys = { merchants: () => ['pay', 'brand-payment', 'merchants'] as const };
