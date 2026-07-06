import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-text-secondary">{label}</label>}
      <input
        ref={ref}
        className={`rounded-md border px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-border-focus ${error ? 'border-border-error' : 'border-border-default'} ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-error">{error}</span>}
    </div>
  )
);
Input.displayName = 'Input';
