'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
import { mainQueryKeys } from '../services/queryKeys';

export function useHome() {
  const { data, isLoading } = useQuery({
    queryKey: mainQueryKeys.banners(),
    queryFn: () => apiClient.get<{ banners: { id: string; imageUrl: string; link: string }[] }>('/main/banners'),
  });
  return { banners: data?.banners ?? [], isLoading };
}
