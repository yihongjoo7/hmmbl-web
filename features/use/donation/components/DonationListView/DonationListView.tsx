/** [퍼블리셔] 기부 목록 화면 레이아웃 */
interface Donation { id: string; title: string; organization: string; totalDonated: number; }
export function DonationListView({ donations = [], isLoading, onItemClick }: { donations?: Donation[]; isLoading?: boolean; onItemClick?: (id: string) => void }) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  return (
    <div className="flex flex-col gap-3 p-4">
      {donations.map(d => (
        <div key={d.id} onClick={() => onItemClick?.(d.id)} className="p-4 border rounded-xl cursor-pointer">
          <p className="font-medium text-sm">{d.title}</p>
          <p className="text-xs text-gray-400 mt-0.5">{d.organization}</p>
          <p className="text-xs text-blue-600 mt-1">누적 기부: {d.totalDonated.toLocaleString()}P</p>
        </div>
      ))}
    </div>
  );
}
