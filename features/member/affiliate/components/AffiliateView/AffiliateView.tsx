/** [퍼블리셔] 계열사 연결 화면 레이아웃 */
interface AffiliateItem { id: string; name: string; isConnected: boolean; logoUrl?: string; }
interface AffiliateViewProps { affiliates?: AffiliateItem[]; isLoading?: boolean; onConnect?: (id: string) => void; onDisconnect?: (id: string) => void; }
export function AffiliateView({ affiliates = [], isLoading, onConnect, onDisconnect }: AffiliateViewProps) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-xl font-bold">계열사 연결</h1>
      {affiliates.map(a => (
        <div key={a.id} className="flex items-center justify-between p-4 border rounded-xl">
          <span className="font-medium">{a.name}</span>
          <button onClick={() => a.isConnected ? onDisconnect?.(a.id) : onConnect?.(a.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${a.isConnected ? 'bg-red-50 text-red-600' : 'bg-blue-600 text-white'}`}>
            {a.isConnected ? '연결 해제' : '연결'}
          </button>
        </div>
      ))}
    </div>
  );
}
