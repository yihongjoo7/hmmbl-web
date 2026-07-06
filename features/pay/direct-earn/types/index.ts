export type DirectEarnType = 'receipt' | 'coupon' | 'card';
export interface DirectEarnResult { earnedPoint: number; message: string; }
export const DirectEarnErrorCode = { ALREADY_EARNED: 'DIRECT_EARN_ALREADY_EARNED', INVALID_DATA: 'DIRECT_EARN_INVALID_DATA' } as const;
