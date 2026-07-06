/** [퍼블리셔] 클럽 화면 레이아웃 */
interface Club { id: string; name: string; isJoined: boolean; benefit: string; }
interface ClubViewProps { clubs?: Club[]; isLoading?: boolean; onJoin?: (id: string) => void; }
export function ClubView({ clubs = [], isLoading, onJoin }: ClubViewProps) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-xl font-bold">클럽</h1>
      {clubs.map(c => (
        <div key={c.id} className="p-4 border rounded-xl flex items-center justify-between">
          <div><p className="font-medium">{c.name}</p><p className="text-xs text-gray-400 mt-0.5">{c.benefit}</p></div>
          {!c.isJoined && <button onClick={() => onJoin?.(c.id)} className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-sm">가입</button>}
        </div>
      ))}
    </div>
  );
}
