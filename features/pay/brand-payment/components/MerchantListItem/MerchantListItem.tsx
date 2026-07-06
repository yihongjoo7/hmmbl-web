/** [퍼블리셔] 가맹점 목록 항목 */
export function MerchantListItem({ name, logoUrl, onClick }: { name: string; logoUrl?: string; onClick?: () => void }) {
  return <div onClick={onClick} className="flex items-center gap-3 p-3 border-b cursor-pointer hover:bg-gray-50"><div className="w-10 h-10 rounded-full bg-gray-100 shrink-0" /><span className="text-sm font-medium">{name}</span></div>;
}
