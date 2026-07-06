'use client';
/** [개발자] 계열사 연결 Container */
import { useAffiliate } from '../hooks/useAffiliate';
import { AffiliateView } from './components/AffiliateView/AffiliateView';

export default function AffiliatePage() {
  const { affiliates, isLoading, connect, disconnect } = useAffiliate();
  return <AffiliateView affiliates={affiliates} isLoading={isLoading} onConnect={connect} onDisconnect={disconnect} />;
}
