export const donationQueryKeys = { list: () => ['use', 'donation', 'list'] as const, detail: (id: string) => ['use', 'donation', id] as const, my: () => ['use', 'donation', 'my'] as const };
