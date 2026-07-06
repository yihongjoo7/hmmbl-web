/** [퍼블리셔] 브랜드결제 화면 레이아웃 */
interface Merchant { id: string; name: string; logoUrl?: string; }
interface BrandPaymentViewProps { merchants?: Merchant[]; barcode?: string; isLoading?: boolean; onRequestBarcode?: () => void; }
export function BrandPaymentView({ merchants = [], barcode, isLoading, onRequestBarcode }: BrandPaymentViewProps) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-bold">브랜드결제</h1>
      {barcode
        ? <div className="bg-gray-100 rounded-xl p-8 flex flex-col items-center gap-3"><p className="font-mono text-2xl tracking-[0.3em]">{barcode}</p><p className="text-xs text-gray-400">결제 바코드</p></div>
        : <button onClick={onRequestBarcode} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold">바코드 발급</button>}
      <div>
        <h2 className="text-sm font-bold text-gray-700 mb-3">가맹점</h2>
        <div className="grid grid-cols-3 gap-3">{merchants.map(m => <div key={m.id} className="flex flex-col items-center gap-1 p-3 border rounded-xl"><div className="w-10 h-10 rounded-full bg-gray-100" /><p className="text-xs text-center text-gray-600">{m.name}</p></div>)}</div>
      </div>
    </div>
  );
}
