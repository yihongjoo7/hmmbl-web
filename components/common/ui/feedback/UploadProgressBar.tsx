// components/common/ui/feedback/UploadProgressBar.tsx
'use client';

interface UploadProgressBarProps {
  /** 진행률 0 ~ 100 */
  progress: number;
}

export function UploadProgressBar({ progress }: UploadProgressBarProps) {
  return (
    <div className="upload-progress w-full">
      <div
        className="upload-progress__bar h-1.5 rounded-full bg-brand-primary transition-[width] duration-200"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      />
      <span className="upload-progress__label mt-1 block text-xs text-text-secondary">{progress}%</span>
    </div>
  );
}
