/**
 * 퍼블리셔용 목업 데이터
 *
 * 개발자가 세팅하는 더미 데이터 모음
 * 퍼블리셔는 이 데이터를 import해서 화면에 뿌립니다
 */

// ── 공통 ────────────────────────────────────────────────────────────────────

export const mockUser = {
  name: '홍길동',
  point: 12_500,
  grade: 'VIP',
};

// ── 적립(earn) ───────────────────────────────────────────────────────────────

export const mockCoupons = [
  { id: '1', brand: '스타벅스', title: '아메리카노 50% 할인', discount: '50%', expiresAt: '2025.12.31', isNew: true },
  { id: '2', brand: 'CGV', title: '영화 1+1', discount: '1+1', expiresAt: '2025.11.30', isNew: false },
  { id: '3', brand: '올리브영', title: '3만원 이상 구매 시 3천P 적립', discount: '3,000P', expiresAt: '2025.10.15', isNew: false },
];

export const mockCouponFilters = [
  { id: 'all', label: '전체' },
  { id: 'food', label: '식음료' },
  { id: 'culture', label: '문화' },
  { id: 'beauty', label: '뷰티' },
];

export const mockMissions = [
  { id: '1', title: '오늘의 걷기 미션', reward: 50, progress: 70, total: 100, unit: '걸음', isCompleted: false },
  { id: '2', title: '영상 시청 미션', reward: 30, progress: 1, total: 1, unit: '개', isCompleted: true },
  { id: '3', title: '설문 참여 미션', reward: 100, progress: 0, total: 1, unit: '개', isCompleted: false },
];

export const mockEvents = [
  { id: '1', title: '여름 포인트 폭탄 이벤트', badge: 'D-3', imageUrl: '/images/event-summer.png', isWished: false },
  { id: '2', title: '오늘의 룰렛 찬스', badge: 'HOT', imageUrl: '/images/event-roulette.png', isWished: true },
];

// ── 사용(use) ────────────────────────────────────────────────────────────────

export const mockProducts = [
  { id: '1', brand: '현대백화점', title: '더현대 상품권 1만원권', price: 10_000, point: 10_000, imageUrl: '/images/product-1.png' },
  { id: '2', brand: 'GS25', title: 'GS25 모바일 상품권 5천원', price: 5_000, point: 5_000, imageUrl: '/images/product-2.png' },
];

// ── 결제(pay) ────────────────────────────────────────────────────────────────

export const mockPayHistory = [
  { id: '1', store: '스타벅스 강남점', date: '2025.07.01', amount: -4_500, type: 'use' as const },
  { id: '2', store: '포인트 충전', date: '2025.06.28', amount: +10_000, type: 'earn' as const },
];

// ── 마이페이지(my) ───────────────────────────────────────────────────────────

export const mockMyHistory = [
  { id: '1', category: '구매', title: 'GS25 모바일 상품권', date: '2025.07.01', amount: -5_000 },
  { id: '2', category: '선물', title: '스타벅스 쿠폰 선물받음', date: '2025.06.25', amount: 0 },
];

export const mockBadges = [
  { id: '1', title: '첫 걸음', imageUrl: '/images/badge-first.png', isAcquired: true },
  { id: '2', title: '기부왕', imageUrl: '/images/badge-donation.png', isAcquired: false },
  { id: '3', title: '미션 마스터', imageUrl: '/images/badge-mission.png', isAcquired: false },
];
