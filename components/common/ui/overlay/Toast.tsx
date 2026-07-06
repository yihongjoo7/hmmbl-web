'use client';
import { useEffect } from 'react';
import type { Toast } from '@/hooks/useToastStore';
import { useToastStore } from '@/hooks/useToastStore';

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const remove = useToastStore((s) => s.removeToast);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={remove} />
      ))}
    </div>
  );
}

const typeClass: Record<Toast['type'], string> = {
  success: 'bg-success',
  error:   'bg-error',
  info:    'bg-primary',
  warning: 'bg-warning',
};

function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), toast.duration ?? 3000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  return (
    <div
      className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-text-inverse shadow-lg ${typeClass[toast.type]}`}
    >
      <span>{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="ml-auto text-white/80 hover:text-white"
      >
        ✕
      </button>
    </div>
  );
}
