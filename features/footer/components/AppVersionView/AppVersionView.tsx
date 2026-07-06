/** [퍼블리셔] 앱 버전 화면 레이아웃 */
export function AppVersionView({ version, latestVersion, hasUpdate }: { version: string; latestVersion?: string; hasUpdate?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-6">
      <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">H</div>
      <div className="text-center"><h1 className="text-xl font-bold">H.Point</h1><p className="text-sm text-gray-500 mt-1">버전 {version}</p></div>
      {hasUpdate
        ? <div className="w-full max-w-xs bg-blue-50 border border-blue-200 rounded-xl p-4 text-center"><p className="text-sm text-blue-700 font-medium">새 버전이 있습니다 ({latestVersion})</p><button className="mt-3 w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium">업데이트</button></div>
        : <p className="text-sm text-green-600 font-medium">✓ 최신 버전입니다</p>}
    </div>
  );
}
