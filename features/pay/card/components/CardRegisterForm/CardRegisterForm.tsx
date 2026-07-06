/** [퍼블리셔] 카드 등록 폼 */
export function CardRegisterForm({ onSubmit }: { onSubmit?: (data: { cardNo: string; expiry: string; cvc: string }) => void }) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-1"><label className="text-sm font-medium">카드 번호</label><input className="border rounded-xl px-4 py-3 text-sm" placeholder="0000 0000 0000 0000" /></div>
      <div className="flex gap-3"><div className="flex-1 flex flex-col gap-1"><label className="text-sm font-medium">유효기간</label><input className="border rounded-xl px-4 py-3 text-sm" placeholder="MM/YY" /></div><div className="flex-1 flex flex-col gap-1"><label className="text-sm font-medium">CVC</label><input type="password" className="border rounded-xl px-4 py-3 text-sm" placeholder="000" maxLength={3} /></div></div>
      <button onClick={() => onSubmit?.({ cardNo: '', expiry: '', cvc: '' })} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold">카드 등록</button>
    </div>
  );
}
