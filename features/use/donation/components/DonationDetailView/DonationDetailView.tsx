/** [퍼블리셔] 기부 상세 화면 레이아웃 */
interface DonationDetail { title: string; organization: string; description?: string; minPoint?: number; }
export function DonationDetailView({ donation, isLoading, onDonate }: { donation?: DonationDetail; isLoading?: boolean; onDonate?: (amount: number) => void }) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  if (!donation) return null;
  return (
    <div className="flex flex-col gap-6 p-6 pb-24">
      <h1 className="text-xl font-bold">{donation.title}</h1>
      <p className="text-sm text-blue-500">{donation.organization}</p>
      {donation.description && <p className="text-sm text-gray-500 leading-relaxed">{donation.description}</p>}
      <button onClick={() => onDonate?.(donation.minPoint ?? 100)} className="fixed bottom-6 left-6 right-6 py-4 bg-green-600 text-white rounded-xl font-bold">기부하기</button>
    </div>
  );
}
