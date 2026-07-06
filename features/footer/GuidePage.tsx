'use client';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
import { GuideView } from './components/GuideView/GuideView';
export default function GuidePage() { const { data, isLoading } = useQuery({ queryKey: ['footer', 'guide'], queryFn: () => apiClient.get('/footer/guide') }); return <GuideView content={data} isLoading={isLoading} />; }
