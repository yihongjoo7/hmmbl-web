/** [퍼블리셔] 홈 배너 (플로팅·어드민) */
interface HomeBannerProps { imageUrl: string; link?: string; type?: 'floating' | 'admin'; onClose?: () => void; }
export function HomeBanner({ imageUrl, onClose, type = 'admin' }: HomeBannerProps) {
  return (
    <div className={`relative w-full ${type === 'floating' ? 'fixed bottom-20 left-0 right-0 z-30 px-4' : ''}`}>
      <img src={imageUrl} alt="배너" className="w-full rounded-lg" />
      {onClose && <button onClick={onClose} className="absolute top-2 right-2 w-6 h-6 bg-black/40 text-white rounded-full text-xs">✕</button>}
    </div>
  );
}
