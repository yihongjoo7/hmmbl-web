/** [퍼블리셔] 전환 화면 레이아웃 */
export function TransferView({ onTransfer, isLoading }: { onTransfer?: (amount: number) => void; isLoading?: boolean }) {
  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-bold">포인트 전환</h1>
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"><div className="flex-1 text-center"><p className="text-xs text-gray-400">H.Point</p><p className="font-bold">→</p></div><div className="flex-1 text-center"><p className="text-xs text-gray-400">제휴사</p></div></div>
      <button onClick={() => onTransfer?.(1000)} disabled={isLoading} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-50">전환하기</button>
    </div>
  );
}
