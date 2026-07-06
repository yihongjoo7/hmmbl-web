/** [퍼블리셔] 챌린지 카드 */
interface ChallengeCardProps { title: string; reward: number; duration: string; type: 'normal' | 'monthly' | 'friend'; isJoined?: boolean; onClick?: () => void; }
export function ChallengeCard({ title, reward, duration, type, isJoined, onClick }: ChallengeCardProps) {
  const badge = type === 'monthly' ? '월간' : type === 'friend' ? '친구와 함께' : '';
  return (
    <div onClick={onClick} className="p-4 border rounded-xl cursor-pointer">
      <div className="flex items-start justify-between gap-2">
        <div><p className="font-medium text-sm">{title}</p>{badge && <span className="text-xs text-blue-500 font-medium">{badge}</span>}</div>
        <span className="text-xs text-blue-600 font-bold shrink-0">+{reward}P</span>
      </div>
      <p className="text-xs text-gray-400 mt-1">{duration}</p>
      {isJoined && <span className="text-xs text-green-600 font-medium mt-1 block">✓ 참여중</span>}
    </div>
  );
}
