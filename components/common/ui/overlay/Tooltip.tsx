'use client';
import { ReactNode, useState } from 'react';

type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';
interface TooltipProps { children: ReactNode; content: string; placement?: TooltipPlacement; }

const placementStyles: Record<TooltipPlacement, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
  left: 'right-full top-1/2 -translate-y-1/2 mr-1.5',
  right: 'left-full top-1/2 -translate-y-1/2 ml-1.5',
};

export function Tooltip({ children, content, placement = 'top' }: TooltipProps) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-flex"
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}
      onTouchStart={() => setShow(true)} onTouchEnd={() => setShow(false)}>
      {children}
      {show && (
        <div className={`absolute z-50 px-2 py-1 text-xs text-text-inverse bg-text-primary rounded whitespace-nowrap ${placementStyles[placement]}`}>
          {content}
        </div>
      )}
    </div>
  );
}
