/** [퍼블리셔] 계정 관리 화면 레이아웃 */
interface SocialAccount { provider: 'google' | 'apple'; isLinked: boolean; email?: string; }
export function AccountView({ accounts = [], isLoading, onUnlink, onWithdraw }: { accounts?: SocialAccount[]; isLoading?: boolean; onUnlink?: (provider: string) => void; onWithdraw?: () => void }) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  const ICONS: Record<string, string> = { google: '🔵', apple: '⚫' };
  const LABELS: Record<string, string> = { google: 'Google', apple: 'Apple' };
  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-bold">계정 관리</h1>
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-bold text-gray-700">소셜 계정 연동</h2>
        {(['google', 'apple'] as const).map(provider => {
          const acc = accounts.find(a => a.provider === provider);
          return (
            <div key={provider} className="flex items-center justify-between p-4 border rounded-xl">
              <div className="flex items-center gap-3"><span className="text-xl">{ICONS[provider]}</span><div><p className="font-medium text-sm">{LABELS[provider]}</p>{acc?.email && <p className="text-xs text-gray-400">{acc.email}</p>}</div></div>
              {acc?.isLinked
                ? <button onClick={() => onUnlink?.(provider)} className="text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-lg">연결 해제</button>
                : <button className="text-xs text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg">연결하기</button>}
            </div>
          );
        })}
      </div>
      <button onClick={onWithdraw} className="mt-4 text-sm text-gray-400 underline text-center">회원탈퇴</button>
    </div>
  );
}
