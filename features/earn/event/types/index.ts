export interface Event { id: string; title: string; description?: string; badge?: string; expiresAt?: string; isWished?: boolean; isParticipated?: boolean; }
export const EventErrorCode = { NOT_FOUND: 'EVENT_NOT_FOUND', EXPIRED: 'EVENT_EXPIRED', ALREADY_PARTICIPATED: 'EVENT_ALREADY_PARTICIPATED' } as const;
