export interface MyHistoryItem  { id: string; category: string; title: string; date: string; amount: number; }
export interface MyActivityItem { id: string; type: string; title: string; date: string; reward?: number; }
export interface MyPointSummary { totalPoint: number; expiringPoint: number; expiringDate: string; }
export interface MyBadge        { id: string; title: string; isAcquired: boolean; acquiredAt?: string; }
export interface MyCoupon       { id: string; brand: string; title: string; expiresAt: string; status: 'available' | 'used' | 'expired'; }
export interface WishItem       { id: string; title: string; type: 'event' | 'coupon'; }
export interface InterestPoint  { id: string; name: string; address: string; category: string; }
export interface LoginRecord    { id: string; device: string; ip: string; loggedAt: string; isCurrent?: boolean; }
export interface MyAsset        { totalPoint: number; cashBalance: number; }
