export interface Product { id: string; brand: string; title: string; price: number; point: number; description?: string; }
export const ProductErrorCode = { NOT_FOUND: 'PRODUCT_NOT_FOUND', OUT_OF_STOCK: 'PRODUCT_OUT_OF_STOCK', INSUFFICIENT_POINT: 'INSUFFICIENT_POINT' } as const;
