/** [퍼블리셔] 통합검색 결과 항목 */
interface SearchResultItemProps { title: string; description?: string; type?: string; onClick?: () => void; }
export function SearchResultItem({ title, description, type, onClick }: SearchResultItemProps) {
  return (
    <div onClick={onClick} className="px-4 py-3 border-b cursor-pointer hover:bg-gray-50">
      {type && <span className="text-xs text-blue-500 font-medium">{type}</span>}
      <p className="text-sm font-medium mt-0.5">{title}</p>
      {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
    </div>
  );
}
