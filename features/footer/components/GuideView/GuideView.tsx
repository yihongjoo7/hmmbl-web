/** [퍼블리셔] 이용안내 화면 레이아웃 */
export function GuideView({ content, isLoading }: { content?: unknown; isLoading?: boolean }) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  return <div className="p-6"><h1 className="text-xl font-bold mb-4">이용안내</h1><div className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{typeof content === 'string' ? content : 'H.Point 서비스 이용안내 내용이 표시됩니다.'}</div></div>;
}
