/** [퍼블리셔] 컬처 상세 화면 레이아웃 */
interface CultureDetail { title: string; category: string; description?: string; point: number; audioUrl?: string; }
export function CultureDetailView({ item, isLoading }: { item?: CultureDetail; isLoading?: boolean }) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  if (!item) return null;
  return (
    <div className="flex flex-col gap-6 p-6 pb-24">
      <span className="text-xs text-blue-500 font-medium">{item.category}</span>
      <h1 className="text-xl font-bold">{item.title}</h1>
      {item.description && <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>}
      {item.audioUrl && <div className="bg-gray-100 rounded-xl p-4 flex items-center gap-3"><span className="text-2xl">🎵</span><div className="flex-1"><p className="text-sm font-medium">오디오 재생</p><p className="text-xs text-gray-400 mt-0.5">SoundGallery Player</p></div></div>}
      <div className="fixed bottom-6 left-6 right-6"><p className="text-center text-blue-600 font-bold text-lg">{item.point.toLocaleString()}P</p></div>
    </div>
  );
}
