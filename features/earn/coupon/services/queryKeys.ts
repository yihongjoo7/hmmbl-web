export const couponQueryKeys = { list: (f: string) => ['earn', 'coupon', 'list', f] as const, detail: (id: string) => ['earn', 'coupon', id] as const };
