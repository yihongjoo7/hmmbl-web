/** [퍼블리셔] 전환 폼 */
export function TransferForm({ amount, onAmountChange, partner, onPartnerChange, partners = [] }: { amount: string; onAmountChange: (v: string) => void; partner: string; onPartnerChange: (v: string) => void; partners?: { id: string; name: string }[] }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1"><label className="text-sm font-medium text-gray-700">전환 대상</label><select value={partner} onChange={e => onPartnerChange(e.target.value)} className="border rounded-xl px-4 py-3 text-sm"><option value="">선택하세요</option>{partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
      <div className="flex flex-col gap-1"><label className="text-sm font-medium text-gray-700">전환 금액</label><input type="number" value={amount} onChange={e => onAmountChange(e.target.value)} className="border rounded-xl px-4 py-3 text-right font-bold" placeholder="0" /></div>
    </div>
  );
}
