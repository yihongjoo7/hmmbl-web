export interface Quiz { id: string; title: string; type: 'multiple' | 'short' | 'ox'; choices?: string[]; reward: number; }
export const QuizErrorCode = { NOT_FOUND: 'QUIZ_NOT_FOUND', ALREADY_ANSWERED: 'QUIZ_ALREADY_ANSWERED' } as const;
