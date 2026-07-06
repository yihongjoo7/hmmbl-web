/** [퍼블리셔] 클럽 카드 (구독 전/후) */
interface ClubCardProps { name: string; benefit: string; isJoined: boolean; onJoin?: () => void; onCancel?: () => void; }
export function ClubCard({ name, benefit, isJoined, onJoin, onCancel }: ClubCardProps) {
  return (
    <div className="p-4 border rounded-xl flex items-center justify-between">
      <div><p className="font-medium text-sm">{name}</p><p className="text-xs text-gray-400 mt-0.5">{benefit}</p></div>
      <button onClick={isJoined ? onCancel : onJoin}
        className={`px-4 py-1.5 rounded-full text-sm font-medium ${isJoined ? 'bg-red-50 text-red-500' : 'bg-blue-600 text-white'}`}>
        {isJoined ? '구독 취소' : '구독'}
      </button>
    </div>
  );
}
