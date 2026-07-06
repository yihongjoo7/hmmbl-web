'use client';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
import { TermsView } from './components/TermsView/TermsView';
export default function TermsPage() { const { data, isLoading } = useQuery({ queryKey: ['footer', 'terms'], queryFn: () => apiClient.get('/footer/terms') }); return <TermsView terms={data} isLoading={isLoading} />; }
