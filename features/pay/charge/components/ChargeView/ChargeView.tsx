/** [퍼블리셔] 충전 화면 레이아웃 */
const AMOUNTS = [10000, 30000, 50000, 100000];
export function ChargeView({ onCharge, isLoading }: { onCharge?: (amount: number) => void; isLoading?: boolean }) {
  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-bold">포인트 충전</h1>
      <div className="grid grid-cols-2 gap-3">
        {AMOUNTS.map(a => <button key={a} onClick={() => onCharge?.(a)} disabled={isLoading} className="py-4 border rounded-xl font-bold text-sm disabled:opacity-50 hover:border-blue-500 hover:text-blue-600">{a.toLocaleString()}원</button>)}
      </div>
    </div>
  );
}
