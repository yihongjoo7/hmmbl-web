/** [퍼블리셔] 사운드 갤러리 플레이어 */
interface SoundGalleryPlayerProps { title: string; audioUrl: string; isPlaying?: boolean; onToggle?: () => void; currentTime?: number; duration?: number; }
export function SoundGalleryPlayer({ title, isPlaying, onToggle, currentTime = 0, duration = 0 }: SoundGalleryPlayerProps) {
  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  return (
    <div className="bg-gray-900 rounded-2xl p-6 flex flex-col gap-4">
      <p className="text-white font-medium text-center">{title}</p>
      <div className="bg-gray-700 rounded-full h-1.5"><div className="bg-blue-400 h-1.5 rounded-full" style={{ width: `${pct}%` }} /></div>
      <div className="flex justify-between text-xs text-gray-400"><span>{fmt(currentTime)}</span><span>{fmt(duration)}</span></div>
      <button onClick={onToggle} className="w-14 h-14 rounded-full bg-blue-600 text-white text-2xl mx-auto flex items-center justify-center">{isPlaying ? '⏸' : '▶'}</button>
    </div>
  );
}
