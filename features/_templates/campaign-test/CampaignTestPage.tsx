'use client';
/**
 * features/_templates/campaign-test/CampaignTestPage.tsx
 *
 * 테스트용 템플릿: nextjs-new 의 캠페인 테스트(주문 목록 조회) 화면
 *   (app/m/(protected)/campaign/test/page.tsx)을 복사한 것.
 * 개발 허브(/dev)의 "캠페인 테스트" 카드 → /dev/campaign-test 라우트에서 렌더된다.
 *
 * 변경점:
 *   - feature import를 동일 폴더 상대경로로 조정.
 *   - i18n(next-intl) 제거 → 한국어 문자열 인라인 (self-contained).
 *   - React.* 네임스페이스 대신 타입 직접 import.
 */

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useCampaignTest } from './hooks/useCampaignTest';
import type { OrderListRequest, OrderItem } from './types';

const INITIAL_FORM: OrderListRequest = {
  from:        '',
  to:          '',
  productCode: '',
};

function formatDateTime(iso: string) {
  return iso.replace('T', ' ').slice(0, 19);
}

function formatNumber(n: number) {
  return n.toLocaleString('ko-KR');
}

export default function CampaignTestPage() {
  const { mutate, isPending, isError, error } = useCampaignTest();
  const [form,   setForm]   = useState<OrderListRequest>(INITIAL_FORM);
  const [orders, setOrders] = useState<OrderItem[] | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof OrderListRequest, string>>>({});

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function validate(): boolean {
    const next: typeof errors = {};
    if (!form.from) next.from = '시작일을 입력하세요.';
    if (!form.to)   next.to   = '종료일을 입력하세요.';
    if (form.from && form.to && form.from > form.to)
      next.to = '종료일은 시작일 이후여야 합니다.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setOrders(null);

    const payload: OrderListRequest = {
      from: form.from,
      to:   form.to,
      ...(form.productCode?.trim() ? { productCode: form.productCode.trim() } : {}),
    };

    mutate(payload, {
      onSuccess: (res) => setOrders(res.orders ?? []),
    });
  }

  function handleReset() {
    setForm(INITIAL_FORM);
    setOrders(null);
    setErrors({});
  }

  const totalAmount = orders?.reduce((sum, o) => sum + o.amount, 0) ?? 0;

  return (
    <main className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-text-primary mb-6">캠페인 테스트 — 주문 목록 조회</h1>

      {/* 입력 폼 */}
      <form onSubmit={handleSubmit} className="bg-bg-primary rounded-xl border border-border-default p-6 space-y-5 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 시작일 */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-text-primary">
              시작일 <span className="text-error">*</span>
            </label>
            <input
              type="date"
              name="from"
              value={form.from}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.from ? 'border-error' : 'border-border-muted'
              }`}
            />
            {errors.from && <p className="text-xs text-error">{errors.from}</p>}
          </div>

          {/* 종료일 */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-text-primary">
              종료일 <span className="text-error">*</span>
            </label>
            <input
              type="date"
              name="to"
              value={form.to}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.to ? 'border-error' : 'border-border-muted'
              }`}
            />
            {errors.to && <p className="text-xs text-error">{errors.to}</p>}
          </div>
        </div>

        {/* 상품코드 */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-text-primary">
            상품코드 <span className="text-text-disabled font-normal">(선택 — 미입력 시 전체)</span>
          </label>
          <input
            type="text"
            name="productCode"
            value={form.productCode ?? ''}
            onChange={handleChange}
            placeholder="예: PROD-001"
            className="w-full px-3 py-2 text-sm border border-border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* API 에러 */}
        {isError && (
          <p className="text-sm text-error">
            {error instanceof Error ? error.message : '요청에 실패했습니다.'}
          </p>
        )}

        {/* 버튼 */}
        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 py-2.5 text-sm font-medium bg-primary text-text-inverse rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? '조회 중…' : '조회'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 text-sm font-medium text-text-secondary bg-bg-tertiary rounded-lg hover:bg-bg-hover transition-colors"
          >
            초기화
          </button>
        </div>
      </form>

      {/* 결과 테이블 */}
      {orders !== null && (
        <div className="bg-bg-primary rounded-xl border border-border-default overflow-hidden">
          <div className="px-5 py-3 border-b border-border-subtle flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-primary">
              조회 결과 <span className="text-primary">{orders.length}건</span>
            </h2>
            {orders.length > 0 && (
              <span className="text-sm text-text-secondary">
                합계: <span className="font-semibold text-text-primary">{formatNumber(totalAmount)}원</span>
              </span>
            )}
          </div>

          {orders.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-text-disabled">
              조회된 주문이 없습니다.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-bg-secondary text-text-secondary text-xs">
                  <tr>
                    <th className="px-4 py-3 text-right  font-medium">주문번호</th>
                    <th className="px-4 py-3 text-left   font-medium">주문일시</th>
                    <th className="px-4 py-3 text-left   font-medium">상품명</th>
                    <th className="px-4 py-3 text-right  font-medium">수량</th>
                    <th className="px-4 py-3 text-right  font-medium">단가</th>
                    <th className="px-4 py-3 text-right  font-medium">금액</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {orders.map((order) => (
                    <tr key={order.no} className="hover:bg-bg-secondary transition-colors">
                      <td className="px-4 py-3 text-right  text-text-secondary">{order.no}</td>
                      <td className="px-4 py-3 text-left   text-text-secondary whitespace-nowrap">{formatDateTime(order.orderedAt)}</td>
                      <td className="px-4 py-3 text-left   text-text-primary font-medium">{order.productName}</td>
                      <td className="px-4 py-3 text-right  text-text-secondary">{formatNumber(order.quantity)}</td>
                      <td className="px-4 py-3 text-right  text-text-secondary">{formatNumber(order.unitPrice)}</td>
                      <td className="px-4 py-3 text-right  text-text-primary font-semibold">{formatNumber(order.amount)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-bg-secondary border-t border-border-default">
                  <tr>
                    <td colSpan={5} className="px-4 py-3 text-right text-xs font-medium text-text-secondary">합계</td>
                    <td className="px-4 py-3 text-right text-sm font-bold text-primary">{formatNumber(totalAmount)}원</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
