/** [퍼블리셔] 설정 메인 화면 레이아웃 */
const MENUS = [
  { href: '/settings/profile',       label: '개인정보변경',    icon: '👤' },
  { href: '/settings/security',      label: '생체인증/비밀번호', icon: '🔐' },
  { href: '/settings/notification',  label: '알림 설정',        icon: '🔔' },
  { href: '/settings/account',       label: '계정 관리',        icon: '⚙️' },
];
export function SettingsView() {
  return (
    <div className="flex flex-col">
      <div className="px-4 py-3 border-b"><h1 className="text-xl font-bold">설정</h1></div>
      {MENUS.map(m => (
        <a key={m.href} href={m.href} className="flex items-center gap-4 px-4 py-4 border-b hover:bg-gray-50">
          <span className="text-xl">{m.icon}</span>
          <span className="flex-1 font-medium text-sm">{m.label}</span>
          <span className="text-gray-400">›</span>
        </a>
      ))}
    </div>
  );
}
