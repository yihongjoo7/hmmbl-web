'use client';
import { useEffect, useRef } from 'react';

interface InfiniteScrollTriggerProps {
  onTrigger: () => void;
  hasMore: boolean;
  loading?: boolean;
  threshold?: number;
}

export function InfiniteScrollTrigger({ onTrigger, hasMore, loading = false, threshold = 0.1 }: InfiniteScrollTriggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !hasMore) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting && !loading) onTrigger(); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, loading, onTrigger, threshold]);

  if (!hasMore) return null;
  return (
    <div ref={ref} className="flex justify-center py-4">
      {loading && (
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      )}
    </div>
  );
}
