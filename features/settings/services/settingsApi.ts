import { apiClient } from '@/lib/api/apiClient';
export const settingsApi = {
  profile:            () => apiClient.get('/settings/profile'),
  updateProfile:      (data: unknown) => apiClient.put('/settings/profile', data),
  security:           () => apiClient.get('/settings/security'),
  toggleBiometric:    () => apiClient.post('/settings/security/biometric/toggle'),
  changePassword:     (data: unknown) => apiClient.post('/settings/security/password', data),
  notifications:      () => apiClient.get('/settings/notifications'),
  toggleNotification: (id: string) => apiClient.post(`/settings/notifications/${id}/toggle`),
  accounts:           () => apiClient.get('/settings/accounts'),
  unlinkAccount:      (provider: string) => apiClient.post(`/settings/accounts/${provider}/unlink`),
  withdraw:           () => apiClient.post('/settings/withdraw'),
  requestOtp:         (phone: string) => apiClient.post('/auth/otp/request', { phone }),
  verifyOtp:          (phone: string, code: string) => apiClient.post('/auth/otp/verify', { phone, code }),
};
