/** [퍼블리셔] 공지사항 화면 레이아웃 */
interface Notice { id: string; title: string; date: string; isImportant?: boolean; }
export function NoticeView({ notices = [], isLoading, onNoticeClick }: { notices?: Notice[]; isLoading?: boolean; onNoticeClick?: (id: string) => void }) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  return (
    <div className="flex flex-col">
      <div className="px-4 py-3 border-b"><h1 className="text-xl font-bold">공지사항</h1></div>
      {notices.map(n => (
        <div key={n.id} onClick={() => onNoticeClick?.(n.id)} className="px-4 py-4 border-b cursor-pointer hover:bg-gray-50">
          <div className="flex items-start gap-2">{n.isImportant && <span className="shrink-0 text-xs font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">공지</span>}<p className="font-medium text-sm">{n.title}</p></div>
          <p className="text-xs text-gray-400 mt-1">{n.date}</p>
        </div>
      ))}
    </div>
  );
}
