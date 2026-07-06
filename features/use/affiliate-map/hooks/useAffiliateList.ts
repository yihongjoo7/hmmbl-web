'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useAffiliateList() { const [filter, setFilter] = useState('all'); const { data, isLoading } = useQuery({ queryKey: ['use', 'affiliate-map', 'list', filter], queryFn: () => apiClient.get<{ affiliates: { id: string; name: string; category: string; address: string }[] }>('/use/affiliates', { filter }) }); return { affiliates: data?.affiliates ?? [], isLoading, filter, setFilter }; }
