export const receiptQueryKeys = { list: () => ['pay', 'receipt', 'list'] as const, detail: (id: string) => ['pay', 'receipt', id] as const };
