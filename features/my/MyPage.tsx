'use client';
import { useAuthStore } from '@/features/auth/hooks/useAuthStore';
import { MyView } from './components/MyView/MyView';
export default function MyPage() { const user = useAuthStore(s => s.user); return <MyView user={user} />; }
