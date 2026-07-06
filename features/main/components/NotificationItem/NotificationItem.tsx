/** [퍼블리셔] 알림함 항목 */
interface NotificationItemProps { title: string; body: string; createdAt: string; isRead?: boolean; onClick?: () => void; }
export function NotificationItem({ title, body, createdAt, isRead, onClick }: NotificationItemProps) {
  return (
    <div onClick={onClick} className={`px-4 py-4 cursor-pointer border-b ${isRead ? 'opacity-50' : 'bg-blue-50/30'}`}>
      <p className="font-medium text-sm">{title}</p>
      <p className="text-xs text-gray-500 mt-0.5">{body}</p>
      <p className="text-xs text-gray-300 mt-1">{createdAt}</p>
    </div>
  );
}
