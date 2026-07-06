export interface Survey { id: string; title: string; reward: number; isCompleted: boolean; expiresAt?: string; }
export interface SurveyQuestion { id: string; text: string; type: 'single' | 'multi' | 'short' | 'scale' | 'matrix' | 'slider' | 'video'; choices?: string[]; }
export const SurveyErrorCode = { NOT_FOUND: 'SURVEY_NOT_FOUND', ALREADY_COMPLETED: 'SURVEY_ALREADY_COMPLETED' } as const;
