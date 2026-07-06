export const quizQueryKeys = { list: () => ['earn', 'quiz', 'list'] as const, detail: (id: string) => ['earn', 'quiz', id] as const };
