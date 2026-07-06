/** [퍼블리셔] 알림함 화면 레이아웃 */
interface NotifItem { id: string; title: string; body: string; isRead: boolean; createdAt: string; }
interface NotificationViewProps { items?: NotifItem[]; isLoading?: boolean; onRead?: (id: string) => void; }

export function NotificationView({ items = [], isLoading, onRead }: NotificationViewProps) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  return (
    <ul className="flex flex-col divide-y divide-gray-100">
      {items.map(n => (
        <li key={n.id} onClick={() => onRead?.(n.id)}
          className={`px-4 py-4 cursor-pointer ${n.isRead ? 'opacity-50' : ''}`}>
          <p className="font-medium text-sm">{n.title}</p>
          <p className="text-xs text-gray-500 mt-0.5">{n.body}</p>
        </li>
      ))}
      {items.length === 0 && <p className="p-6 text-center text-gray-400 text-sm">알림이 없습니다.</p>}
    </ul>
  );
}
