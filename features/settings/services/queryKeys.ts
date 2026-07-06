export const settingsQueryKeys = {
  profile:       () => ['settings', 'profile'] as const,
  security:      () => ['settings', 'security'] as const,
  notification:  () => ['settings', 'notification'] as const,
  account:       () => ['settings', 'account'] as const,
};
