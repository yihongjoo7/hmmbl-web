/** [퍼블리셔] MY기부 뱃지북·나무 단계 */
export function DonationBadgeBook({ totalDonated, treeLevel, badges = [] }: { totalDonated: number; treeLevel: number; badges?: { id: string; isAcquired: boolean }[] }) {
  const TREE = ['🌱', '🌿', '🌳', '🌲', '🏔️'];
  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <div className="text-7xl">{TREE[Math.min(treeLevel - 1, TREE.length - 1)]}</div>
      <p className="text-sm text-gray-500">총 기부 포인트: <strong className="text-green-600">{totalDonated.toLocaleString()}P</strong></p>
      <div className="grid grid-cols-5 gap-2 w-full">{badges.map((b, i) => <div key={i} className={`aspect-square rounded-full bg-gray-100 flex items-center justify-center text-lg ${!b.isAcquired ? 'opacity-30 grayscale' : ''}`}>🏅</div>)}</div>
    </div>
  );
}
