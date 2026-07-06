export interface RouletteResult { reward: number; label: string; }
export interface RouletteSegment { label: string; reward: number; color: string; probability: number; }
export const RouletteErrorCode = { ALREADY_PLAYED: 'ROULETTE_ALREADY_PLAYED', LIMIT_REACHED: 'ROULETTE_LIMIT_REACHED' } as const;
