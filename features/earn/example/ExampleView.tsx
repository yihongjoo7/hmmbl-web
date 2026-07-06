// features/earn/example/ExampleView.tsx
interface ExampleViewProps {
  items?: { id: string; title: string }[];
  isLoading?: boolean;
  errorMessage?: string;
  onItemClick?: (id: string) => void;
}

export function ExampleView({
  items = [],
  isLoading = false,
  errorMessage,
  onItemClick,
}: ExampleViewProps) {
  if (isLoading) return <div className="animate-pulse p-4">로딩 중...</div>;
  if (errorMessage) return <div className="p-4 text-text-secondary">{errorMessage}</div>;
  if (items.length === 0) return <div className="p-4">항목이 없습니다</div>;

  return (
    <div className="flex flex-col gap-2 p-4">
      {items.map((item) => (
        <button key={item.id} onClick={() => onItemClick?.(item.id)}>
          {item.title}
        </button>
      ))}
    </div>
  );
}