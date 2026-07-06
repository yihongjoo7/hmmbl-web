export interface Mission { id: string; title: string; description?: string; reward: number; progress: number; total: number; isCompleted: boolean; type: 'gauge' | 'stamp' | 'multi' | 'visit'; }
export const MissionErrorCode = { NOT_FOUND: 'MISSION_NOT_FOUND', ALREADY_COMPLETED: 'MISSION_ALREADY_COMPLETED' } as const;
