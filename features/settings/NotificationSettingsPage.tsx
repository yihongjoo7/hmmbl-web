'use client';
import { useNotificationSettings } from './hooks/useNotificationSettings';
import { NotificationSettingsView } from './components/NotificationSettingsView/NotificationSettingsView';
export default function NotificationSettingsPage() { const { settings, isLoading, toggle } = useNotificationSettings(); return <NotificationSettingsView settings={settings} isLoading={isLoading} onToggle={toggle} />; }
