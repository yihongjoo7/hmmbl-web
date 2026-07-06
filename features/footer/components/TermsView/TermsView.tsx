/** [퍼블리셔] 약관 및 정책 화면 레이아웃 */
interface Term { id: string; title: string; updatedAt: string; }
export function TermsView({ terms, isLoading, onTermClick }: { terms?: unknown; isLoading?: boolean; onTermClick?: (id: string) => void }) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  const list: Term[] = Array.isArray(terms) ? terms : [{ id: '1', title: '서비스 이용약관', updatedAt: '2025.01.01' }, { id: '2', title: '개인정보 처리방침', updatedAt: '2025.01.01' }, { id: '3', title: '위치정보 이용약관', updatedAt: '2025.01.01' }];
  return (
    <div className="flex flex-col">
      <div className="px-4 py-3 border-b"><h1 className="text-xl font-bold">약관 및 정책</h1></div>
      {list.map(t => <div key={t.id} onClick={() => onTermClick?.(t.id)} className="px-4 py-4 border-b flex justify-between items-center cursor-pointer hover:bg-gray-50"><p className="text-sm font-medium">{t.title}</p><div className="flex items-center gap-2"><p className="text-xs text-gray-400">{t.updatedAt}</p><span className="text-gray-400">›</span></div></div>)}
    </div>
  );
}
