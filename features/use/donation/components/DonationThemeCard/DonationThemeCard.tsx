/** [퍼블리셔] 테마기부 카드 */
export function DonationThemeCard({ title, organization, imageUrl, onClick }: { title: string; organization: string; imageUrl?: string; onClick?: () => void }) {
  return <div onClick={onClick} className="border rounded-xl overflow-hidden cursor-pointer"><div className="w-full aspect-video bg-gray-100" /><div className="p-3"><p className="font-medium text-sm">{title}</p><p className="text-xs text-gray-400 mt-0.5">{organization}</p></div></div>;
}
