'use client';
/** [개발자] 쿠폰 상세 Container */
import { useCouponDetail } from './hooks/useCouponDetail';
import { CouponDetailView } from './components/CouponDetailView/CouponDetailView';

export default function CouponDetailPage({ couponId }: { couponId: string }) {
  const { coupon, isLoading, use } = useCouponDetail(couponId);
  return <CouponDetailView coupon={coupon} isLoading={isLoading} onUse={use} />;
}
