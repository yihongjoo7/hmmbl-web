'use client';
import { ReactNode, useEffect } from 'react';
import { useModalStore } from '@/hooks/useModalStore';

interface ModalProps { id: string; title?: string; children: ReactNode; }

export function Modal({ id, title, children }: ModalProps) {
  const { isOpen, close } = useModalStore();
  const open = isOpen(id);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close(id); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, id, close]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={() => close(id)} />
      <div className="relative z-10 w-full max-w-md rounded-lg bg-bg-primary p-6 shadow-xl">
        {title && <h2 className="mb-4 text-lg font-semibold text-text-primary">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
