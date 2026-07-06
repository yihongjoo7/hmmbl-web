'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
import { couponQueryKeys } from '../services/queryKeys';

const FILTERS = [{ id: 'all', label: '전체' }, { id: 'food', label: '식음료' }, { id: 'culture', label: '문화' }, { id: 'beauty', label: '뷰티' }];

export function useCouponList() {
  const [selectedFilter, setFilter] = useState('all');
  const { data, isLoading } = useQuery({
    queryKey: couponQueryKeys.list(selectedFilter),
    queryFn: () => apiClient.get<{ coupons: { id: string; brand: string; title: string; discount: string; expiresAt: string; isNew?: boolean }[] }>('/earn/coupons', { filter: selectedFilter }),
  });
  return { coupons: data?.coupons ?? [], filters: FILTERS, selectedFilter, setFilter, isLoading };
}
