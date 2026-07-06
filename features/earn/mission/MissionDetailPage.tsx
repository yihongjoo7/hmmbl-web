'use client';
/** [개발자] 미션 상세 Container */
import { useMissionDetail } from './hooks/useMissionDetail';
import { MissionDetailView } from './components/MissionDetailView/MissionDetailView';
export default function MissionDetailPage({ missionId }: { missionId: string }) {
  const { mission, isLoading, participate } = useMissionDetail(missionId);
  return <MissionDetailView mission={mission} isLoading={isLoading} onParticipate={participate} />;
}
