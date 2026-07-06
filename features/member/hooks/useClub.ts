'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clubApi } from '../services/clubApi';
import { memberQueryKeys } from '../services/queryKeys';

export function useClub() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: memberQueryKeys.clubs(),
    queryFn: () => clubApi.list(),
  });
  const { mutate: join } = useMutation({ mutationFn: (id: string) => clubApi.join(id), onSuccess: () => qc.invalidateQueries({ queryKey: memberQueryKeys.clubs() }) });
  return { clubs: data?.clubs ?? [], isLoading, join };
}
