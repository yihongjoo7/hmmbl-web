export const mainQueryKeys = {
  all: ['main'] as const,
  banners: () => [...mainQueryKeys.all, 'banners'] as const,
  notifications: () => [...mainQueryKeys.all, 'notifications'] as const,
  search: (q: string) => [...mainQueryKeys.all, 'search', q] as const,
  chatbot: () => [...mainQueryKeys.all, 'chatbot'] as const,
};
