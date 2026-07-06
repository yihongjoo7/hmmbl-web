/** [퍼블리셔] GiftHistory 목록 레이아웃 — IA No.262 */

interface GiftHistoryItem {
  id: string;
  // TODO: IA 기준 필드 추가
}

interface GiftHistoryListViewProps {
  items?: GiftHistoryItem[];
  isLoading?: boolean;
}

export function GiftHistoryListView({ items = [], isLoading }: GiftHistoryListViewProps) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  if (!items.length) return <div className="p-6 text-center text-gray-400">항목이 없습니다.</div>;
  return (
    <div className="flex flex-col gap-3 p-4">
      {items.map((item) => (
        <div key={item.id} className="p-4 border rounded-xl">
          <p className="text-sm text-gray-500">{item.id}</p>
        </div>
      ))}
    </div>
  );
}
