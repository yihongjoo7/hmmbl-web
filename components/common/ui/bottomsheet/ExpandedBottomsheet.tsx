import React from 'react';
import { Drawer as VaulDrawer } from 'vaul';
import { cn } from '../lib/utils';

interface ExpandedTabItem {
  label: string;
  value: string;
}

interface ExpandedBottomsheetProps {
  visible: boolean;
  onClose: () => void;
  items: ExpandedTabItem[];
  onSelect: (key: string) => void;
  className?: string;
}

export const ExpandedBottomsheet = ({
  visible,
  onClose,
  items,
  onSelect,
  className,
}: ExpandedBottomsheetProps) => {
  const handleItemClick = (key: string) => {
    onSelect(key);
    onClose();
  };

  const handleOpenChange = (open: boolean) => {
    if (open) return;
    onClose();
  };

  return (
    <VaulDrawer.Root open={visible} onOpenChange={handleOpenChange} direction="top">
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay className="fixed inset-0 z-40 bg-black/40" />
        <VaulDrawer.Content
          className={cn('fixed inset-x-0 top-0 z-50 flex flex-col bg-white rounded-b-[24px] outline-none', className)}
        >
          <VaulDrawer.Title className="sr-only">필터</VaulDrawer.Title>
          <VaulDrawer.Description className="sr-only" />

          <div className="flex flex-wrap gap-2 min-h-0 bg-white">
            {items.map((item) => {
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => handleItemClick(item.value)}
                  className="flex items-center justify-center px-4 py-2 text-sm font-base transition-all text-font-700"
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  );
};
