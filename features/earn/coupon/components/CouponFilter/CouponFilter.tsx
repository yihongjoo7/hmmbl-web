/** [퍼블리셔] 쿠폰 필터 */
interface CouponFilterProps { filters: { id: string; label: string }[]; selected: string; onChange: (id: string) => void; }
export function CouponFilter({ filters, selected, onChange }: CouponFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto py-2 px-4">
      {filters.map(f => (
        <button key={f.id} onClick={() => onChange(f.id)}
          className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium ${selected === f.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{f.label}</button>
      ))}
    </div>
  );
}
