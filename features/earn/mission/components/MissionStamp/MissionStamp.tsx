/** [퍼블리셔] 스탬프 미션 UI */
interface MissionStampProps { total: number; stamped: number; }
export function MissionStamp({ total, stamped }: MissionStampProps) {
  return (
    <div className="grid grid-cols-5 gap-2 p-4">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className={`aspect-square rounded-full flex items-center justify-center text-sm ${i < stamped ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-300'}`}>
          {i < stamped ? '✓' : i + 1}
        </div>
      ))}
    </div>
  );
}
