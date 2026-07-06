export interface TransferPartner { id: string; name: string; minAmount: number; maxAmount: number; ratio: number; }
export interface TransferHistory { id: string; partnerName: string; amount: number; transferredAmount: number; transferredAt: string; }
export const TransferErrorCode = { INSUFFICIENT_POINT: 'TRANSFER_INSUFFICIENT_POINT', PARTNER_UNAVAILABLE: 'TRANSFER_PARTNER_UNAVAILABLE', LIMIT_EXCEEDED: 'TRANSFER_LIMIT_EXCEEDED' } as const;
