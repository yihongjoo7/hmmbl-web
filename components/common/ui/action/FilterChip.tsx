'use client';
interface FilterChipProps {
  label: string;
  selected?: boolean;
  onToggle?: (selected: boolean) => void;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function FilterChip({ label, selected = false, onToggle, disabled = false, icon }: FilterChipProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onToggle?.(!selected)}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors focus:outline-none
        ${selected
          ? 'bg-primary text-text-inverse border-primary'
          : 'bg-bg-primary text-text-primary border-border-muted hover:border-border-hover'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {icon && <span>{icon}</span>}
      {label}
      {selected && (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
    </button>
  );
}
