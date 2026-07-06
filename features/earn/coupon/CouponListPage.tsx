'use client';
/** [개발자] 쿠폰 목록 Container */
import { useCouponList } from './hooks/useCouponList';
import { CouponListView } from './components/CouponListView/CouponListView';

export default function CouponListPage() {
  const { coupons, filters, selectedFilter, setFilter, isLoading } = useCouponList();
  return <CouponListView coupons={coupons} filters={filters} selectedFilter={selectedFilter} onFilterChange={setFilter} isLoading={isLoading} />;
}
