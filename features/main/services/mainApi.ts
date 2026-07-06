import { apiClient } from '@/lib/api/apiClient';

export const mainApi = {
  getBanners: () => apiClient.get('/main/banners'),
  getNotifications: () => apiClient.get('/main/notifications'),
  markNotificationRead: (id: string) => apiClient.post(`/main/notifications/${id}/read`),
  chatbot: (message: string) => apiClient.post('/main/chatbot', { message }),
  search: (q: string) => apiClient.get('/main/search', { q }),
};
