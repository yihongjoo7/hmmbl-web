// 원본: nextjs-new/features/campaign/types/index.ts (주문 목록 조회 부분만 발췌)
// ── 주문 목록 조회 (POST /biz/order/order-list) ───────────────────────
export interface OrderListRequest {
  from:         string;
  to:           string;
  productCode?: string;
}

export interface OrderItem {
  no:          number;
  orderedAt:   string;
  productName: string;
  quantity:    number;
  unitPrice:   number;
  amount:      number;
}

export interface OrderListResponse {
  orders: OrderItem[];
  total: number;
}
