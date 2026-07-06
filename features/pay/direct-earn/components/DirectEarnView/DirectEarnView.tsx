/** [퍼블리셔] 사후적립 화면 레이아웃 */
type EarnType = 'receipt' | 'coupon' | 'card';
export function DirectEarnView({ onSubmit, isLoading }: { onSubmit?: (type: EarnType, data: unknown) => void; isLoading?: boolean }) {
  const TYPES: { id: EarnType; label: string; icon: string }[] = [{ id: 'receipt', label: '종이영수증', icon: '🧾' }, { id: 'coupon', label: '이벤트쿠폰', icon: '🎫' }, { id: 'card', label: '현대백화점카드', icon: '💳' }];
  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-bold">사후·직접 적립</h1>
      <div className="grid grid-cols-3 gap-3">
        {TYPES.map(t => <button key={t.id} onClick={() => onSubmit?.(t.id, {})} disabled={isLoading} className="flex flex-col items-center gap-2 p-4 border rounded-xl hover:border-blue-500 disabled:opacity-50"><span className="text-2xl">{t.icon}</span><span className="text-xs font-medium text-gray-700">{t.label}</span></button>)}
      </div>
    </div>
  );
}
