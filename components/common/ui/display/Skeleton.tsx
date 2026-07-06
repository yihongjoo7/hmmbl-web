interface SkeletonProps {
  width?:    string | number;
  height?:   string | number;
  rounded?:  'sm' | 'md' | 'lg' | 'full';
  className?: string;
  paused?:   boolean;
  /** shimmer: 좌→우 물결 (기본) | pulse: 깜빡임 */
  variant?:  'shimmer' | 'pulse';
}

const roundedClass = {
  sm:   'rounded-sm',
  md:   'rounded-md',
  lg:   'rounded-lg',
  full: 'rounded-full',
};

export function Skeleton({
  width = '100%',
  height = 16,
  rounded = 'md',
  className = '',
  paused = false,
  variant = 'shimmer',
}: SkeletonProps) {
  const animClass =
    variant === 'pulse'
      ? `animate-pulse bg-bg-hover ${paused ? '[animation-play-state:paused]' : ''}`
      : `skeleton-shimmer ${paused ? 'paused' : ''}`;

  return (
    <div
      className={`${animClass} ${roundedClass[rounded]} ${className}`}
      style={{ width, height }}
    />
  );
}

export function SkeletonText({
  lines = 3,
  paused = false,
  variant = 'shimmer',
}: {
  lines?: number;
  paused?: boolean;
  variant?: 'shimmer' | 'pulse';
}) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} width={i === lines - 1 ? '60%' : '100%'} height={14} paused={paused} variant={variant} />
      ))}
    </div>
  );
}

export function SkeletonCard({
  paused = false,
  variant = 'shimmer',
}: {
  paused?: boolean;
  variant?: 'shimmer' | 'pulse';
}) {
  return (
    <div className="p-4 border border-border-default rounded-lg flex flex-col gap-3">
      <Skeleton height={20} width="50%" paused={paused} variant={variant} />
      <SkeletonText lines={3} paused={paused} variant={variant} />
    </div>
  );
}
