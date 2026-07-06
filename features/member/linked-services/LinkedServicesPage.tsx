'use client';
/** [개발자] LinkedServices 목록 Container — IA No.95-97 */
// 역할: useLinkedServices 훅에서 데이터를 받아 LinkedServicesListView에 전달합니다.
// TODO: 훅 이름, View 이름, import 경로를 실제 기능명으로 변경하세요.

import { useLinkedServices } from './hooks/useLinkedServices';
import { LinkedServicesListView } from './LinkedServicesView';

export default function LinkedServicesPage() {
  const { items, isLoading } = useLinkedServices();
  return <LinkedServicesListView items={items} isLoading={isLoading} />;
}
