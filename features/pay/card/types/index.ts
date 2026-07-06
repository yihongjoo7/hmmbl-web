export interface Card { id: string; name: string; last4: string; expiry: string; isPrimary: boolean; }
export const CardErrorCode = { REGISTER_FAIL: 'CARD_REGISTER_FAIL', NOT_FOUND: 'CARD_NOT_FOUND', DELETE_FAIL: 'CARD_DELETE_FAIL' } as const;
