/** [퍼블리셔] 공지사항 목록 항목 */
export function NoticeItem({ title, date, isImportant, onClick }: { title: string; date: string; isImportant?: boolean; onClick?: () => void }) {
  return <div onClick={onClick} className="px-4 py-4 border-b cursor-pointer hover:bg-gray-50"><div className="flex items-start gap-2">{isImportant && <span className="shrink-0 text-xs font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">공지</span>}<p className="font-medium text-sm">{title}</p></div><p className="text-xs text-gray-400 mt-1">{date}</p></div>;
}
