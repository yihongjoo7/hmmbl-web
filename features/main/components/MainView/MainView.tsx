/** [퍼블리셔] 홈 메인 화면 레이아웃 — props → 렌더링만 */
interface MainViewProps {
  banners?: { id: string; imageUrl: string; link: string }[];
  isLoading?: boolean;
}

export function MainView({ banners = [], isLoading }: MainViewProps) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  return (
    <div className="flex flex-col gap-4 pb-20">
      <section className="w-full aspect-video bg-gray-100 flex items-center justify-center">
        {banners[0] ? <img src={banners[0].imageUrl} alt="배너" className="w-full h-full object-cover" /> : <span className="text-gray-400">배너 영역</span>}
      </section>
    </div>
  );
}
