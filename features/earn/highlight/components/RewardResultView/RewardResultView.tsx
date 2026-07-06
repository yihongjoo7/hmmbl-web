/** [퍼블리셔] 혜택받기 완료 */
type RewardType = 'coupon' | 'gifticon' | 'point';
export function RewardResultView({ rewardType, amount, label }: { rewardType: RewardType; amount?: number; label?: string }) {
  const icon = rewardType === 'coupon' ? '🎫' : rewardType === 'gifticon' ? '🎁' : '💰';
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <div className="text-6xl">{icon}</div>
      <h2 className="text-xl font-bold text-center">{rewardType === 'point' ? `+${amount}P 적립 완료!` : `${label ?? '혜택'} 지급 완료!`}</h2>
    </div>
  );
}
