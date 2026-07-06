'use client';
import { useState } from 'react';
import { useLocation } from '@/features/shared/hooks/useLocation';
export function useAffiliateMap() { const { location, requestLocation, isLoading, error } = useLocation(); const [selectedId, setSelectedId] = useState<string | null>(null); return { location, requestLocation, selectedId, setSelectedId, isLoading, error }; }
