export interface GiftOrder { productId: string; recipientName: string; recipientPhone: string; message?: string; }
export const GiftErrorCode = { SEND_FAIL: 'GIFT_SEND_FAIL', INVALID_PHONE: 'GIFT_INVALID_PHONE' } as const;
