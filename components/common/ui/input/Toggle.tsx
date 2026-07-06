'use client';
interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Toggle({ checked, onChange, label, disabled = false, size = 'md' }: ToggleProps) {
  const sizes = {
    sm: { track: 'w-8 h-4', thumb: 'w-3 h-3', translate: 'translate-x-4' },
    md: { track: 'w-11 h-6', thumb: 'w-5 h-5', translate: 'translate-x-5' },
    lg: { track: 'w-14 h-7', thumb: 'w-6 h-6', translate: 'translate-x-7' },
  };
  const s = sizes[size];
  return (
    <label className={`flex items-center gap-2 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex items-center ${s.track} rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring-focus
          ${checked ? 'bg-primary' : 'bg-border-muted'}`}
      >
        <span className={`inline-block ${s.thumb} bg-bg-primary rounded-full shadow transform transition-transform
          ${checked ? s.translate : 'translate-x-0.5'}`} />
      </button>
      {label && <span className="text-sm text-text-primary">{label}</span>}
    </label>
  );
}
