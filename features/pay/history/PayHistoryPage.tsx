'use client';
/** [개발자] PayHistory 목록 Container — IA No.460 */
// 역할: usePayHistory 훅에서 데이터를 받아 PayHistoryListView에 전달합니다.
// TODO: 훅 이름, View 이름, import 경로를 실제 기능명으로 변경하세요.

import { usePayHistory } from './hooks/usePayHistory';
import { PayHistoryListView } from './PayHistoryView';

export default function PayHistoryPage() {
  const { items, isLoading } = usePayHistory();
  return <PayHistoryListView items={items} isLoading={isLoading} />;
}
