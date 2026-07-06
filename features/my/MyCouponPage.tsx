'use client';
import { useMyCoupon } from './hooks/useMyCoupon';
import { MyCouponView } from './components/MyCouponView/MyCouponView';
export default function MyCouponPage() { const { coupons, isLoading } = useMyCoupon(); return <MyCouponView coupons={coupons} isLoading={isLoading} />; }
