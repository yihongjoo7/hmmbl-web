'use client';
import { useAffiliateList } from './hooks/useAffiliateList';
import { AffiliateMapView } from './components/AffiliateMapView/AffiliateMapView';
export default function AffiliateMapPage() { const { affiliates, isLoading } = useAffiliateList(); return <AffiliateMapView affiliates={affiliates} isLoading={isLoading} />; }
