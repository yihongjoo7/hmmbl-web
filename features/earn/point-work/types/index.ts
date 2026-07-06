export interface PointWorkDashboard { steps: number; goalSteps: number; todayPoint: number; totalPoint: number; }
export interface Challenge { id: string; title: string; description?: string; reward: number; duration: string; type: 'normal' | 'monthly' | 'friend'; isJoined: boolean; }
export const PointWorkErrorCode = { STEPS_SYNC_FAIL: 'STEPS_SYNC_FAIL', CHALLENGE_JOIN_FAIL: 'CHALLENGE_JOIN_FAIL' } as const;
