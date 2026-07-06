export interface Receipt { id: string; storeName: string; amount: number; paidAt: string; items?: { name: string; qty: number; price: number }[]; }
export const ReceiptErrorCode = { NOT_FOUND: 'RECEIPT_NOT_FOUND' } as const;
