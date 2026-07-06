'use client';
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
import { mainQueryKeys } from '../services/queryKeys';

export function useSearch() {
  const [query, setQuery] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: mainQueryKeys.search(query),
    queryFn: () => apiClient.get<{ results: { id: string; title: string; type: string }[] }>('/main/search', { q: query }),
    enabled: query.length > 1,
  });
  return { query, setQuery: useCallback((q: string) => setQuery(q), []), results: data?.results ?? [], isLoading };
}
