/** [퍼블리셔] 계열사 카드 (연결 현황) */
interface AffiliateCardProps { name: string; logoUrl?: string; isConnected: boolean; onToggle?: () => void; }
export function AffiliateCard({ name, logoUrl, isConnected, onToggle }: AffiliateCardProps) {
  return (
    <div className="flex items-center gap-4 p-4 border rounded-xl">
      {logoUrl && <img src={logoUrl} alt={name} className="w-10 h-10 rounded-full object-cover" />}
      <span className="flex-1 font-medium text-sm">{name}</span>
      <button onClick={onToggle} className={`px-3 py-1 rounded-full text-xs font-medium ${isConnected ? 'bg-gray-100 text-gray-600' : 'bg-blue-600 text-white'}`}>
        {isConnected ? '연결됨' : '연결하기'}
      </button>
    </div>
  );
}
