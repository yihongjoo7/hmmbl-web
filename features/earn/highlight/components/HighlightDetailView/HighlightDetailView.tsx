/** [퍼블리셔] 하이라이트 상세 화면 레이아웃 */
interface HLDetail { title: string; brand: string; description?: string; reward: number; expiresAt: string; isClaimed: boolean; }
export function HighlightDetailView({ highlight, isLoading, onClaim }: { highlight?: HLDetail; isLoading?: boolean; onClaim?: () => void }) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  if (!highlight) return null;
  return (
    <div className="flex flex-col gap-6 p-6 pb-24">
      <p className="text-xs text-gray-400">{highlight.brand}</p>
      <h1 className="text-xl font-bold">{highlight.title}</h1>
      {highlight.description && <p className="text-sm text-gray-500">{highlight.description}</p>}
      <div className="bg-blue-50 rounded-xl p-4 text-center"><p className="text-3xl font-bold text-blue-600">+{highlight.reward}P</p></div>
      {!highlight.isClaimed && <button onClick={onClaim} className="fixed bottom-6 left-6 right-6 py-4 bg-blue-600 text-white rounded-xl font-bold">혜택 받기</button>}
      {highlight.isClaimed && <p className="text-center text-green-600 font-medium">✓ 혜택을 받았습니다</p>}
    </div>
  );
}
