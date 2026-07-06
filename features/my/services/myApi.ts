import { apiClient } from '@/lib/api/apiClient';
export const myApi = {
  history:       () => apiClient.get('/my/history'),
  activity:      () => apiClient.get('/my/activity'),
  point:         () => apiClient.get('/my/point'),
  badges:        () => apiClient.get('/my/badges'),
  coupons:       () => apiClient.get('/my/coupons'),
  wishlist:      () => apiClient.get('/my/wishlist'),
  removeWish:    (id: string) => apiClient.delete(`/my/wishlist/${id}`),
  interestPoints:() => apiClient.get('/my/interest-points'),
  removeInterest:(id: string) => apiClient.delete(`/my/interest-points/${id}`),
  loginHistory:  () => apiClient.get('/my/login-history'),
  purchases:     () => apiClient.get('/my/purchases'),
  asset:         () => apiClient.get('/my/asset'),
  qr:            () => apiClient.get('/my/qr'),
};
