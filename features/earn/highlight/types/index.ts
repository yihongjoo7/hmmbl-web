export interface Highlight { id: string; title: string; brand: string; description?: string; reward: number; expiresAt: string; isClaimed: boolean; rewardType: 'coupon' | 'gifticon' | 'point'; }
export const HighlightErrorCode = { NOT_FOUND: 'HIGHLIGHT_NOT_FOUND', ALREADY_CLAIMED: 'HIGHLIGHT_ALREADY_CLAIMED', EXPIRED: 'HIGHLIGHT_EXPIRED' } as const;
