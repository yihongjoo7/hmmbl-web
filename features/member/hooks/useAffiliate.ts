'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { affiliateApi } from '../services/affiliateApi';
import { memberQueryKeys } from '../services/queryKeys';

export function useAffiliate() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: memberQueryKeys.affiliates(),
    queryFn: () => affiliateApi.list(),
  });
  const { mutate: connect }    = useMutation({ mutationFn: (id: string) => affiliateApi.connect(id),    onSuccess: () => qc.invalidateQueries({ queryKey: memberQueryKeys.affiliates() }) });
  const { mutate: disconnect } = useMutation({ mutationFn: (id: string) => affiliateApi.disconnect(id), onSuccess: () => qc.invalidateQueries({ queryKey: memberQueryKeys.affiliates() }) });
  return { affiliates: data?.affiliates ?? [], isLoading, connect, disconnect };
}
