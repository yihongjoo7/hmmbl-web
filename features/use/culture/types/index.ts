export interface CultureItem { id: string; title: string; category: string; description?: string; point: number; audioUrl?: string; }
export const CultureErrorCode = { NOT_FOUND: 'CULTURE_NOT_FOUND', PURCHASE_FAIL: 'CULTURE_PURCHASE_FAIL' } as const;
