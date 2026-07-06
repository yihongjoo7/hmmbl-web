'use client';
/** [개발자] 알림함 Container */
import { useNotification } from './hooks/useNotification';
import { NotificationView } from './components/NotificationView/NotificationView';

export default function NotificationPage() {
  const { items, isLoading, markAsRead } = useNotification();
  return <NotificationView items={items} isLoading={isLoading} onRead={markAsRead} />;
}
