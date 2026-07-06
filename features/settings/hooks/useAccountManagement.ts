'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
import { useAuth } from '@/features/auth/hooks/useAuth';
export function useAccountManagement() {
  const qc = useQueryClient();
  const { logout } = useAuth();
  const { data, isLoading } = useQuery({ queryKey: ['settings', 'account'], queryFn: () => apiClient.get<{ accounts: { provider: 'google' | 'apple'; isLinked: boolean; email?: string }[] }>('/settings/accounts') });
  const { mutate: unlink }   = useMutation({ mutationFn: (provider: string) => apiClient.post(`/settings/accounts/${provider}/unlink`), onSuccess: () => qc.invalidateQueries({ queryKey: ['settings', 'account'] }) });
  const { mutate: withdraw } = useMutation({ mutationFn: () => apiClient.post('/settings/withdraw'), onSuccess: () => logout() });
  return { accounts: data?.accounts ?? [], isLoading, unlink, withdraw };
}
