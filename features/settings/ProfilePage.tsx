'use client';
import { useProfile } from './hooks/useProfile';
import { ProfileView } from './components/ProfileView/ProfileView';
export default function ProfilePage() { const { profile, isLoading, update } = useProfile(); return <ProfileView profile={profile} isLoading={isLoading} onUpdate={update} />; }
