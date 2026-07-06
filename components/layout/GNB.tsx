'use client';

interface GNBProps {
  title?: string;
}

export function GNB({ title }: GNBProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-bg-primary border-b border-border-default px-6 py-4 flex items-center">
      <h1 className="text-lg font-bold text-text-primary">{title ?? 'H.Point'}</h1>
    </header>
  );
}
