/** [퍼블리셔] 사후/직접 적립 입력 폼 */
export function DirectEarnForm({ type, onChange }: { type: string; onChange?: (field: string, value: string) => void }) {
  return (
    <div className="flex flex-col gap-4 p-4">
      {type === 'receipt' && <><div className="flex flex-col gap-1"><label className="text-sm font-medium">영수증 번호</label><input onChange={e => onChange?.('receiptNo', e.target.value)} className="border rounded-xl px-4 py-3 text-sm" placeholder="영수증 번호 입력" /></div><div className="flex flex-col gap-1"><label className="text-sm font-medium">구매 금액</label><input type="number" onChange={e => onChange?.('amount', e.target.value)} className="border rounded-xl px-4 py-3 text-sm text-right" placeholder="0" /></div></>}
      {type === 'coupon' && <div className="flex flex-col gap-1"><label className="text-sm font-medium">쿠폰 번호</label><input onChange={e => onChange?.('couponNo', e.target.value)} className="border rounded-xl px-4 py-3 text-sm" placeholder="쿠폰 번호 입력" /></div>}
      {type === 'card' && <div className="flex flex-col gap-1"><label className="text-sm font-medium">카드 번호</label><input onChange={e => onChange?.('cardNo', e.target.value)} className="border rounded-xl px-4 py-3 text-sm" placeholder="카드 번호 입력" /></div>}
    </div>
  );
}
