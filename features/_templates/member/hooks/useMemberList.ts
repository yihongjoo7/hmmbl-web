import { useQuery } from '@tanstack/react-query';
import { memberApi } from '../services/memberApi';
import { memberKeys } from '../services/queryKeys';
import type { MemberListParams } from '../types';

export function useMemberList(params?: MemberListParams) {
  return useQuery({
    queryKey: memberKeys.list(params),
    queryFn: () => memberApi.getList(params),
    staleTime: 1000 * 60,
  });
}
