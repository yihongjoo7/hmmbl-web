export const eventQueryKeys = { list: () => ['earn', 'event', 'list'] as const, detail: (id: string) => ['earn', 'event', id] as const, fortune: () => ['earn', 'daily-fortune'] as const };
