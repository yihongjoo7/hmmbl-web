'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useSecuritySettings() {
  const qc = useQueryClient();
  const { data: settings, isLoading } = useQuery({ queryKey: ['settings', 'security'], queryFn: () => apiClient.get<{ biometricEnabled: boolean; pinEnabled: boolean; patternEnabled: boolean }>('/settings/security') });
  const { mutate: toggleBiometric } = useMutation({ mutationFn: () => apiClient.post('/settings/security/biometric/toggle'), onSuccess: () => qc.invalidateQueries({ queryKey: ['settings', 'security'] }) });
  const { mutate: changePassword }  = useMutation({ mutationFn: (data: unknown) => apiClient.post('/settings/security/password', data) });
  return { settings, isLoading, toggleBiometric, changePassword };
}
