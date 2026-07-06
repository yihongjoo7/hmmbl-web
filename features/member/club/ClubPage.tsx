'use client';
/** [개발자] 클럽 가입/구독 Container */
import { useClub } from '../hooks/useClub';
import { ClubView } from './components/ClubView/ClubView';

export default function ClubPage() {
  const { clubs, isLoading, join } = useClub();
  return <ClubView clubs={clubs} isLoading={isLoading} onJoin={join} />;
}
