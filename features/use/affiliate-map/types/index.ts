export interface AffiliatePlace { id: string; name: string; category: string; address: string; lat: number; lng: number; distance?: string; }
export const AffiliateMapErrorCode = { LOCATION_FAIL: 'LOCATION_FAIL', LIST_FAIL: 'AFFILIATE_LIST_FAIL' } as const;
