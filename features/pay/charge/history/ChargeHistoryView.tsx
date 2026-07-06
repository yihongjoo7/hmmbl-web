/** [퍼블리셔] ChargeHistory 목록 레이아웃 — IA No.422-427 */
// 역할: 전달받은 items 배열을 렌더링합니다. 로딩·빈 목록 상태를 처리합니다.
// TODO: ChargeHistoryItem 타입을 types/index.ts 에서 import 하거나 아래 임시 타입을 확정하세요.

/** ChargeHistoryItem — TODO: types/index.ts 의 정식 타입으로 교체 */
interface ChargeHistoryItem {
  id: string;
  // TODO: IA 기준 필드 추가
}

interface ChargeHistoryListViewProps {
  items?: ChargeHistoryItem[];
  isLoading?: boolean;
  onItemClick?: (id: string) => void; // TODO: 필요 없으면 제거
}

export function ChargeHistoryListView({ items = [], isLoading, onItemClick }: ChargeHistoryListViewProps) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  if (!items.length) return <div className="p-6 text-center text-gray-400">항목이 없습니다.</div>;

  return (
    <div className="flex flex-col gap-3 p-4">
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => onItemClick?.(item.id)}
          className="p-4 border rounded-xl cursor-pointer"
        >
          {/* TODO: 항목 카드 UI 구현 */}
          <p className="text-sm text-gray-500">{item.id}</p>
        </div>
      ))}
    </div>
  );
}
