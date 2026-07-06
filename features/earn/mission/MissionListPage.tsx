'use client';
/** [개발자] 미션 목록 Container */
import { useMissionList } from './hooks/useMissionList';
import { MissionListView } from './components/MissionListView/MissionListView';
export default function MissionListPage() {
  const { missions, isLoading } = useMissionList();
  return <MissionListView missions={missions} isLoading={isLoading} />;
}
