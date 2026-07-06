/** [퍼블리셔] 결제 바코드 */
export function PaymentBarcode({ barcode, expiresAt }: { barcode: string; expiresAt?: string }) {
  return <div className="bg-gray-100 rounded-xl p-8 flex flex-col items-center gap-3"><p className="font-mono text-2xl tracking-[0.3em]">{barcode}</p>{expiresAt && <p className="text-xs text-gray-400">유효시간: {expiresAt}</p>}</div>;
}
