/** [퍼블리셔] 보안 설정 화면 레이아웃 */
interface SecuritySettings { biometricEnabled: boolean; pinEnabled: boolean; patternEnabled: boolean; }
export function SecurityView({ settings, isLoading, onToggleBiometric, onChangePin, onChangePattern }: { settings?: SecuritySettings; isLoading?: boolean; onToggleBiometric?: () => void; onChangePin?: () => void; onChangePattern?: () => void }) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  const s = settings ?? { biometricEnabled: false, pinEnabled: false, patternEnabled: false };
  const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle?: () => void }) => (
    <button onClick={onToggle} className={`w-12 h-6 rounded-full transition-colors ${enabled ? 'bg-blue-600' : 'bg-gray-200'}`}>
      <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform m-0.5 ${enabled ? 'translate-x-6' : ''}`} />
    </button>
  );
  return (
    <div className="flex flex-col">
      <div className="px-4 py-3 border-b"><h1 className="text-xl font-bold">보안 설정</h1></div>
      <div className="flex items-center justify-between px-4 py-4 border-b"><div><p className="font-medium text-sm">생체인증</p><p className="text-xs text-gray-400 mt-0.5">지문 또는 Face ID</p></div><Toggle enabled={s.biometricEnabled} onToggle={onToggleBiometric} /></div>
      <div className="flex items-center justify-between px-4 py-4 border-b"><div><p className="font-medium text-sm">PIN 인증</p></div><div className="flex items-center gap-3"><Toggle enabled={s.pinEnabled} /><button onClick={onChangePin} className="text-xs text-blue-600">변경</button></div></div>
      <div className="flex items-center justify-between px-4 py-4 border-b"><div><p className="font-medium text-sm">패턴 인증</p></div><div className="flex items-center gap-3"><Toggle enabled={s.patternEnabled} /><button onClick={onChangePattern} className="text-xs text-blue-600">변경</button></div></div>
    </div>
  );
}
