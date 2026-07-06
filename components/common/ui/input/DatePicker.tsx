'use client';
import { InputHTMLAttributes, forwardRef } from 'react';

const KO_MONTHS = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  label?: string;
  error?: string;
  /** date | datetime-local | month | year */
  mode?: 'date' | 'datetime-local' | 'month' | 'year';
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement> | { target: { value: string } }) => void;
}

const YEARS = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 10 + i - 89);

const selectCls =
  'px-3 py-2 border border-border-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring-focus focus:border-primary transition-colors bg-bg-primary';

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ label, error, mode = 'date', value = '', onChange, className = '', ...props }, ref) => {
    const base = 'w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 transition-colors';
    const state = error
      ? 'border-error focus:ring-ring-error'
      : 'border-border-muted focus:ring-ring-focus focus:border-primary';

    const MONTHS = KO_MONTHS.map((label, i) => ({
      value: String(i + 1).padStart(2, '0'),
      label,
    }));

    // ── 년-월: 커스텀 year+month select ────────────────────────────────
    if (mode === 'month') {
      const currentYear = String(new Date().getFullYear());
      const [yearPart = currentYear, monthPart = ''] = value
        ? value.split('-')
        : [currentYear, ''];

      function emit(y: string, m: string) {
        onChange?.({ target: { value: y && m ? `${y}-${m}` : '' } });
      }

      return (
        <div className="flex flex-col gap-1">
          {label && <label className="text-sm font-medium text-text-primary">{label}</label>}
          <div className="flex gap-2">
            <select
              value={yearPart}
              onChange={e => emit(e.target.value, monthPart)}
              className={selectCls}
            >
              <option value="">년도</option>
              {YEARS.map(y => (
                <option key={y} value={String(y)}>{y}년</option>
              ))}
            </select>
            <select
              value={monthPart}
              onChange={e => emit(yearPart, e.target.value)}
              className={selectCls}
            >
              <option value="">월</option>
              {MONTHS.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          {error && <p className="text-xs text-error">{error}</p>}
        </div>
      );
    }

    // ── 년: number input ──────────────────────────────────────────────
    if (mode === 'year') {
      return (
        <div className="flex flex-col gap-1">
          {label && <label className="text-sm font-medium text-text-primary">{label}</label>}
          <input
            ref={ref}
            type="number"
            min={1900}
            max={2100}
            placeholder="연도 입력"
            value={value}
            onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
            className={`${base} ${state} ${className}`}
            {...props}
          />
          {error && <p className="text-xs text-error">{error}</p>}
        </div>
      );
    }

    // ── date | datetime-local ─────────────────────────────────────────
    return (
      <div className="flex flex-col gap-1">
        {label && <label className="text-sm font-medium text-text-primary">{label}</label>}
        <input
          ref={ref}
          type={mode}
          value={value}
          onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
          className={`${base} ${state} ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-error">{error}</p>}
      </div>
    );
  }
);
DatePicker.displayName = 'DatePicker';
