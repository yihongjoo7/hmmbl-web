'use client';
/** [개발자] ChargeHistory 목록 Container — IA No.422-427 */
// 역할: useChargeHistory 훅에서 데이터를 받아 ChargeHistoryListView에 전달합니다.
// TODO: 훅 이름, View 이름, import 경로를 실제 기능명으로 변경하세요.

import { useChargeHistory } from './hooks/useChargeHistory';
import { ChargeHistoryListView } from './ChargeHistoryView';

export default function ChargeHistoryPage() {
  const { items, isLoading } = useChargeHistory();
  return <ChargeHistoryListView items={items} isLoading={isLoading} />;
}
