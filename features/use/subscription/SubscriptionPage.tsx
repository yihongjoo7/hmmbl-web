'use client';
import { useSubscriptionCoupon } from './hooks/useSubscriptionCoupon';
import { SubscriptionView } from './components/SubscriptionView/SubscriptionView';
export default function SubscriptionPage() { const { coupons, isLoading, subscribe } = useSubscriptionCoupon(); return <SubscriptionView coupons={coupons} isLoading={isLoading} onSubscribe={subscribe} />; }
