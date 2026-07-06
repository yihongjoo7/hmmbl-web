/** [퍼블리셔] 통합검색 화면 레이아웃 */
interface SearchViewProps {
  query: string; onQueryChange: (q: string) => void;
  results?: { id: string; title: string; type: string }[];
  isLoading?: boolean;
}

export function SearchView({ query, onQueryChange, results = [], isLoading }: SearchViewProps) {
  return (
    <div className="flex flex-col gap-4 px-4 pt-4">
      <input value={query} onChange={e => onQueryChange(e.target.value)}
        placeholder="검색어를 입력하세요" className="w-full px-4 py-3 border rounded-xl text-sm" />
      {isLoading && <p className="text-center text-gray-400 text-sm animate-pulse">검색 중...</p>}
      <ul className="flex flex-col gap-2">
        {results.map(r => <li key={r.id} className="p-3 bg-gray-50 rounded-lg text-sm">{r.title}</li>)}
      </ul>
    </div>
  );
}
