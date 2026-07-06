export interface Donation { id: string; title: string; organization: string; description?: string; totalDonated: number; minPoint: number; type: 'theme' | 'direct' | 'subscribe'; }
export const DonationErrorCode = { NOT_FOUND: 'DONATION_NOT_FOUND', INSUFFICIENT_POINT: 'DONATION_INSUFFICIENT_POINT', ALREADY_SUBSCRIBED: 'DONATION_ALREADY_SUBSCRIBED' } as const;
