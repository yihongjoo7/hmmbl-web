'use client';
import { useState, InputHTMLAttributes } from 'react';
interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onSearch?: (value: string) => void;
  onChange?: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, onChange, onClear, placeholder, className = '', ...props }: SearchBarProps) {
  const [value, setValue] = useState('');
  const handleChange = (v: string) => { setValue(v); onChange?.(v); };
  const handleClear = () => { setValue(''); onClear?.(); onChange?.(''); };
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') onSearch?.(value); };
  return (
    <div className={`relative flex items-center ${className}`}>
      <span className="absolute left-3 text-text-disabled">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </span>
      <input
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder ?? '검색'}
        className="w-full pl-9 pr-8 py-2 border border-border-muted rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-ring-focus"
        {...props}
      />
      {value && (
        <button type="button" onClick={handleClear} className="absolute right-3 text-text-disabled hover:text-text-secondary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
