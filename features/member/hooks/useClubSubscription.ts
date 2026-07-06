'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clubApi } from '../services/clubApi';
import { memberQueryKeys } from '../services/queryKeys';

export function useClubSubscription(clubId: string) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: memberQueryKeys.clubSubscription(clubId),
    queryFn: () => clubApi.getSubscription(clubId),
  });
  const { mutate: subscribe }   = useMutation({ mutationFn: () => clubApi.subscribe(clubId),   onSuccess: () => qc.invalidateQueries({ queryKey: memberQueryKeys.clubs() }) });
  const { mutate: unsubscribe } = useMutation({ mutationFn: () => clubApi.unsubscribe(clubId), onSuccess: () => qc.invalidateQueries({ queryKey: memberQueryKeys.clubs() }) });
  return { subscription: data, isLoading, subscribe, unsubscribe };
}
