import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  rows?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, rows = 4, className = '', ...props }, ref) => {
    const base = 'w-full px-3 py-2 border rounded-md text-sm resize-none focus:outline-none focus:ring-2 transition-colors';
    const state = error
      ? 'border-error focus:ring-ring-error'
      : 'border-border-muted focus:ring-ring-focus focus:border-primary';
    return (
      <div className="flex flex-col gap-1">
        {label && <label className="text-sm font-medium text-text-primary">{label}</label>}
        <textarea ref={ref} rows={rows} className={`${base} ${state} ${className}`} {...props} />
        {error && <p className="text-xs text-error">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
