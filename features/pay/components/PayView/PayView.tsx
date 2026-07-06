/** [퍼블리셔] 결제 서브메인 화면 레이아웃 */
interface PayMenu { id: string; label: string; icon: string; }
const PAY_MENUS: PayMenu[] = [{ id: 'brand-payment', label: '브랜드결제', icon: '🏪' }, { id: 'charge', label: '포인트 충전', icon: '💳' }, { id: 'transfer', label: '포인트 전환', icon: '🔄' }, { id: 'receipt', label: '전자영수증', icon: '🧾' }, { id: 'direct-earn', label: '직접 적립', icon: '📝' }, { id: 'card', label: '카드/Pay 관리', icon: '💰' }];
export function PayView({ onMenuClick }: { onMenuClick?: (id: string) => void }) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-xl font-bold">결제</h1>
      <div className="grid grid-cols-3 gap-3">
        {PAY_MENUS.map(m => <button key={m.id} onClick={() => onMenuClick?.(m.id)} className="flex flex-col items-center gap-2 p-4 border rounded-xl hover:bg-gray-50"><span className="text-2xl">{m.icon}</span><span className="text-xs font-medium text-gray-700">{m.label}</span></button>)}
      </div>
    </div>
  );
}
