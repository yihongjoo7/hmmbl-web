/** [퍼블리셔] 제휴처 필터 */
export function AffiliateFilterBar({ filters, selected, onChange }: { filters: { id: string; label: string }[]; selected: string; onChange: (id: string) => void }) {
  return <div className="flex gap-2 overflow-x-auto px-4 py-2 border-b">{filters.map(f => <button key={f.id} onClick={() => onChange(f.id)} className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium ${selected === f.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{f.label}</button>)}</div>;
}
