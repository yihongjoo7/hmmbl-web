/** [퍼블리셔] QR·바코드 레이아웃 */
export function QrView({ barcode, isLoading }: { barcode?: string; isLoading?: boolean }) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-6">
      <h1 className="text-xl font-bold">QR·바코드</h1>
      {barcode
        ? <div className="bg-gray-100 rounded-2xl p-8 flex flex-col items-center gap-4"><div className="w-40 h-40 bg-white border flex items-center justify-center text-gray-300 text-xs">QR 코드 영역</div><p className="font-mono text-lg tracking-widest">{barcode}</p></div>
        : <p className="text-gray-400 text-sm">바코드를 불러오는 중...</p>}
    </div>
  );
}
