interface NoticeItem {
  id: number;
  text: string;
}

interface NoticeProps {
  title?: string;
  items: NoticeItem[];
  isWarning?: boolean;
}

export const NoticeList = ({ title, items, isWarning = false }: NoticeProps) => {
  return (
    <div className="flex flex-col gap-2">
      {title && (
        <h2 className={`text-title-m ${isWarning ? 'text-system-error-500' : 'text-font-700'}`}>
          {title}
        </h2>
      )}

      <ul className="flex flex-col gap-1">
        {items.map((item) => (
          <li
            key={item.id}
            className={`flex items-start text-body-m  ${isWarning ? 'text-system-error-500' : 'text-font-500'}`}
          >
            <span
              className={`flex items-center justify-center w-4 h-4.5  shrink-0 select-none ${isWarning ? 'text-system-error-500' : 'text-icon-500'}`}
            >
              •
            </span>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
