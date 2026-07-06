export interface ChargeResult { amount: number; point: number; chargedAt: string; }
export const ChargeErrorCode = { PAYMENT_FAIL: 'CHARGE_PAYMENT_FAIL', LIMIT_EXCEEDED: 'CHARGE_LIMIT_EXCEEDED' } as const;
