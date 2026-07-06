/** [퍼블리셔] 챌린지 상세 화면 레이아웃 */
interface Challenge { title: string; description?: string; reward: number; duration: string; isJoined: boolean; progress?: number; }
export function ChallengeDetailView({ challenge, isLoading, onJoin }: { challenge?: Challenge; isLoading?: boolean; onJoin?: () => void }) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  if (!challenge) return null;
  return (
    <div className="flex flex-col gap-6 p-6 pb-24">
      <h1 className="text-xl font-bold">{challenge.title}</h1>
      {challenge.description && <p className="text-sm text-gray-500">{challenge.description}</p>}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 rounded-xl p-4 text-center"><p className="text-xl font-bold text-blue-600">{challenge.reward}P</p><p className="text-xs text-gray-500">달성 보상</p></div>
        <div className="bg-gray-50 rounded-xl p-4 text-center"><p className="text-sm font-bold text-gray-700">{challenge.duration}</p><p className="text-xs text-gray-500">기간</p></div>
      </div>
      {!challenge.isJoined && <button onClick={onJoin} className="fixed bottom-6 left-6 right-6 py-4 bg-blue-600 text-white rounded-xl font-bold">챌린지 참여</button>}
    </div>
  );
}
