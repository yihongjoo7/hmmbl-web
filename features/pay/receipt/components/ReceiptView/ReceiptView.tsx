/** [퍼블리셔] 전자영수증 상세 화면 */
interface ReceiptDetail { storeName: string; amount: number; paidAt: string; items?: { name: string; qty: number; price: number }[]; }
export function ReceiptView({ receipt }: { receipt?: ReceiptDetail }) {
  if (!receipt) return null;
  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-bold">{receipt.storeName}</h1>
      <div className="flex justify-between border-b pb-4"><p className="text-gray-500">결제 금액</p><p className="text-xl font-bold">{receipt.amount.toLocaleString()}원</p></div>
      <p className="text-xs text-gray-400">{receipt.paidAt}</p>
      {receipt.items && (
        <div className="flex flex-col gap-2">
          {receipt.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm"><span>{item.name} x{item.qty}</span><span>{(item.price * item.qty).toLocaleString()}원</span></div>
          ))}
        </div>
      )}
    </div>
  );
}
