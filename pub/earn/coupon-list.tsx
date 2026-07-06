/**
 * 쿠폰 목록 화면 — 퍼블리셔 작성 영역
 *
 * 규칙:
 * - JSX + Tailwind만 사용
 * - props/interface/훅 사용 금지
 * - _mock/data.ts 에서 더미 데이터 import해서 사용
 */

import { mockCoupons, mockCouponFilters } from '../_mock/data';

export default function CouponListScreen() {
  return (
    <div className="flex flex-col h-full bg-white">

      {/* 필터 탭 */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto border-b border-gray-100">
        {mockCouponFilters.map((f) => (
          <button
            key={f.id}
            className="shrink-0 px-4 py-1.5 rounded-full text-sm bg-gray-100 text-gray-600 first:bg-black first:text-white"
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 쿠폰 목록 */}
      <ul className="flex flex-col divide-y divide-gray-100 px-4">
        {mockCoupons.map((coupon) => (
          <li key={coupon.id} className="py-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gray-100 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400">{coupon.brand}</p>
              <p className="font-medium mt-0.5 truncate">{coupon.title}</p>
              <p className="text-xs text-gray-300 mt-1">~{coupon.expiresAt}</p>
            </div>
            <span className="text-sm font-bold text-blue-600 shrink-0">{coupon.discount}</span>
          </li>
        ))}
      </ul>

    </div>
  );
}
