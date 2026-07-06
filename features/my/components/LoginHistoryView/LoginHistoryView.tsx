/** [퍼블리셔] 로그인 이력 레이아웃 */
interface LoginRecord { id: string; device: string; ip: string; loggedAt: string; isCurrent?: boolean; }
export function LoginHistoryView({ history = [], isLoading }: { history?: LoginRecord[]; isLoading?: boolean }) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  return (
    <div className="flex flex-col gap-3 p-4">
      <h1 className="text-xl font-bold">로그인 이력</h1>
      {history.map(h => (
        <div key={h.id} className="border rounded-xl p-4">
          <div className="flex justify-between items-start">
            <p className="font-medium text-sm">{h.device}</p>
            {h.isCurrent && <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">현재</span>}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{h.ip}</p>
          <p className="text-xs text-gray-400 mt-0.5">{h.loggedAt}</p>
        </div>
      ))}
    </div>
  );
}
