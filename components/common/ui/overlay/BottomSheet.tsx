'use client';
import { ReactNode, useEffect, useRef } from 'react';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  snapPoints?: number[];
}

export function BottomSheet({ open, onClose, children, title }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div ref={sheetRef}
        className="relative w-full bg-bg-primary rounded-t-2xl shadow-xl max-h-[90vh] flex flex-col"
        style={{ animation: 'slideUp 0.3s ease-out' }}>
        {/* 드래그 핸들 */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-border-muted rounded-full" />
        </div>
        {title && (
          <div className="px-4 py-3 border-b border-border-default">
            <h2 className="text-base font-semibold text-text-primary">{title}</h2>
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>
      </div>
      <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
    </div>
  );
}
