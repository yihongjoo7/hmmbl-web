type BadgeVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

const variantClass: Record<BadgeVariant, string> = {
  default: 'bg-bg-tertiary text-text-secondary',
  success: 'bg-success-light text-success-text',
  error:   'bg-error-light text-error-text',
  warning: 'bg-warning-light text-warning-text',
  info:    'bg-info-light text-info-text',
};

interface BadgeProps { variant?: BadgeVariant; children: React.ReactNode; className?: string; }

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClass[variant]} ${className}`}>
      {children}
    </span>
  );
}
