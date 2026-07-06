import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Card({ children, padding = 'md', shadow = 'sm', rounded = 'lg', className = '', ...props }: CardProps) {
  const paddings = { none: '', sm: 'p-3', md: 'p-4', lg: 'p-6' };
  const shadows = { none: '', sm: 'shadow-sm', md: 'shadow-md', lg: 'shadow-lg' };
  const roundeds = { sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl' };
  return (
    <div className={`bg-bg-primary border border-border-default ${paddings[padding]} ${shadows[shadow]} ${roundeds[rounded]} ${className}`} {...props}>
      {children}
    </div>
  );
}
