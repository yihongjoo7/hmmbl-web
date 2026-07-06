export const productQueryKeys = { list: () => ['use', 'product', 'list'] as const, detail: (id: string) => ['use', 'product', id] as const };
