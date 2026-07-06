/** [퍼블리셔] 제휴처 지도 화면 레이아웃 */
interface AffItem { id: string; name: string; category: string; address: string; }
export function AffiliateMapView({ affiliates = [], isLoading }: { affiliates?: AffItem[]; isLoading?: boolean }) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 bg-gray-200 flex items-center justify-center text-gray-400 text-sm">지도 영역 (MapView 삽입)</div>
      <div className="h-60 overflow-y-auto border-t">
        {affiliates.map(a => (
          <div key={a.id} className="px-4 py-3 border-b">
            <p className="font-medium text-sm">{a.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{a.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
