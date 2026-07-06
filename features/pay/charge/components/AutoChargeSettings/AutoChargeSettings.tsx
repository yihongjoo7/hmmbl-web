/** [퍼블리셔] 자동·예약 충전 설정 */
interface AutoChargeSettingsProps { isAutoEnabled?: boolean; autoAmount?: number; scheduleDay?: number; onToggleAuto?: () => void; onAmountChange?: (v: number) => void; }
export function AutoChargeSettings({ isAutoEnabled, autoAmount, scheduleDay, onToggleAuto, onAmountChange }: AutoChargeSettingsProps) {
  return (
    <div className="flex flex-col gap-4 p-4 border rounded-xl">
      <div className="flex items-center justify-between"><p className="font-medium text-sm">자동 충전</p><button onClick={onToggleAuto} className={`w-12 h-6 rounded-full transition-colors ${isAutoEnabled ? 'bg-blue-600' : 'bg-gray-200'}`}><div className={`w-5 h-5 rounded-full bg-white shadow transition-transform m-0.5 ${isAutoEnabled ? 'translate-x-6' : ''}`} /></button></div>
      {isAutoEnabled && <p className="text-xs text-gray-500">매월 {scheduleDay}일 {(autoAmount ?? 0).toLocaleString()}원 자동 충전</p>}
    </div>
  );
}
