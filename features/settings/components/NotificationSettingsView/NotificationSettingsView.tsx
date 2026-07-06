/** [퍼블리셔] 알림 설정 화면 레이아웃 */
interface NotifSetting { id: string; label: string; description?: string; enabled: boolean; }
export function NotificationSettingsView({ settings = [], isLoading, onToggle }: { settings?: NotifSetting[]; isLoading?: boolean; onToggle?: (id: string) => void }) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  const defaults: NotifSetting[] = settings.length ? settings : [
    { id: 'marketing', label: '마케팅 알림', description: '이벤트·혜택 정보', enabled: true },
    { id: 'activity',  label: '활동 알림',   description: '미션·포인트 적립',  enabled: true },
    { id: 'payment',   label: '결제 알림',   description: '결제·충전 완료',    enabled: true },
    { id: 'notice',    label: '공지사항',    description: '서비스 공지',       enabled: false },
  ];
  return (
    <div className="flex flex-col">
      <div className="px-4 py-3 border-b"><h1 className="text-xl font-bold">알림 설정</h1></div>
      {defaults.map(s => (
        <div key={s.id} className="flex items-center justify-between px-4 py-4 border-b">
          <div><p className="font-medium text-sm">{s.label}</p>{s.description && <p className="text-xs text-gray-400 mt-0.5">{s.description}</p>}</div>
          <button onClick={() => onToggle?.(s.id)} className={`w-12 h-6 rounded-full transition-colors ${s.enabled ? 'bg-blue-600' : 'bg-gray-200'}`}>
            <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform m-0.5 ${s.enabled ? 'translate-x-6' : ''}`} />
          </button>
        </div>
      ))}
    </div>
  );
}
