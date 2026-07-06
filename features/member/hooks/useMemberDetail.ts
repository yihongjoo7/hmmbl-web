import { useQuery } from '@tanstack/react-query';
import { memberApi } from '../services/memberApi';
import { memberKeys } from '../services/queryKeys';

export function useMemberDetail(id: string) {
  return useQuery({
    queryKey: memberKeys.detail(id),
    queryFn: () => memberApi.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60,
  });
}
