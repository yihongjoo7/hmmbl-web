export interface Merchant { id: string; name: string; logoUrl?: string; category?: string; }
export interface PaymentBarcode { barcode: string; expiresAt: string; }
export const BrandPaymentErrorCode = { BARCODE_ISSUE_FAIL: 'BARCODE_ISSUE_FAIL', TERMS_NOT_AGREED: 'BRAND_PAYMENT_TERMS_NOT_AGREED' } as const;
