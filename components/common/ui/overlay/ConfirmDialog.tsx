'use client';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'default' | 'danger';
}

export function ConfirmDialog({
  open, title, message, confirmLabel, cancelLabel,
  onConfirm, onCancel, variant = 'default'
}: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-bg-primary rounded-xl shadow-xl p-6 w-full max-w-sm mx-4 flex flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold text-text-primary">{title}</h2>
          <p className="mt-1 text-sm text-text-secondary">{message}</p>
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium text-text-primary border border-border-muted hover:bg-bg-secondary transition-colors">
            {cancelLabel ?? '취소'}
          </button>
          <button onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-sm font-medium text-text-inverse transition-colors
              ${variant === 'danger' ? 'bg-error hover:bg-error-hover' : 'bg-primary hover:bg-primary-hover'}`}>
            {confirmLabel ?? '확인'}
          </button>
        </div>
      </div>
    </div>
  );
}
