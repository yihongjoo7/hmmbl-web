import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectOption { value: string; label: string; }
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = '', ...props }, ref) => {
    const base = 'w-full px-3 py-2 border rounded-md text-sm bg-bg-primary focus:outline-none focus:ring-2 transition-colors';
    const state = error
      ? 'border-error focus:ring-ring-error'
      : 'border-border-muted focus:ring-ring-focus focus:border-primary';
    return (
      <div className="flex flex-col gap-1">
        {label && <label className="text-sm font-medium text-text-primary">{label}</label>}
        <select ref={ref} className={`${base} ${state} ${className}`} {...props}>
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {error && <p className="text-xs text-error">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';
