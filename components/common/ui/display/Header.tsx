import { ReactNode } from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  left?: ReactNode;
  right?: ReactNode;
  variant?: 'page' | 'section' | 'modal';
}

export function Header({ title, subtitle, left, right, variant = 'page' }: HeaderProps) {
  const styles = {
    page: 'h-14 px-4 border-b border-border-default bg-bg-primary',
    section: 'h-12 px-4',
    modal: 'h-12 px-4 border-b border-border-default',
  };
  return (
    <header className={`flex items-center gap-3 ${styles[variant]}`}>
      {left && <div className="flex-shrink-0">{left}</div>}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-semibold text-text-primary truncate">{title}</h1>
        {subtitle && <p className="text-xs text-text-secondary truncate">{subtitle}</p>}
      </div>
      {right && <div className="flex-shrink-0">{right}</div>}
    </header>
  );
}
