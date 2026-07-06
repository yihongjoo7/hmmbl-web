/** [퍼블리셔] 충전 금액 입력 */
export function ChargeAmountInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <div className="flex flex-col gap-1"><label className="text-sm font-medium text-gray-700">충전 금액</label><input type="number" value={value} onChange={e => onChange(e.target.value)} className="border rounded-xl px-4 py-3 text-right text-lg font-bold" placeholder="0" /><p className="text-xs text-gray-400 text-right">원</p></div>;
}
