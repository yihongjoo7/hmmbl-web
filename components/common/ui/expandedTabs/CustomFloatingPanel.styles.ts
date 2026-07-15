import { cva } from 'class-variance-authority';

export const FloatingPanelVariants = cva(
  [
    'p-[1px] rounded-full text-xs border border-outline-300',
    '[&_.adm-FloatingPanel-item-label]:tracking-[-0.04em]',
    '[&_.adm-FloatingPanel-item-label]:px-[20px]',
    '[&_.adm-FloatingPanel-item-label]:py-[4px]',
    '[&_.adm-FloatingPanel-item-label]:transition-colors',
    '[&_.adm-FloatingPanel-item-label]:duration-100',
    '[&_.adm-FloatingPanel-item-label]:rounded-full',
    '[&_.adm-FloatingPanel-item.adm-FloatingPanel-item-selected]:bg-[#12131C]',
    '[&_.adm-FloatingPanel-item.adm-FloatingPanel-item-selected]:rounded-full',
    '[&_.adm-FloatingPanel-item.adm-FloatingPanel-item-selected_.adm-FloatingPanel-item-label]:bg-[#12131C]',
    '[&_.adm-FloatingPanel-item.adm-FloatingPanel-item-selected_.adm-FloatingPanel-item-label]:text-white',
    '[&_.adm-FloatingPanel-item.adm-FloatingPanel-item-selected_.adm-FloatingPanel-item-label]:rounded-full',
    '[--indicator-background:#12131C]',
    '[&_.adm-FloatingPanel-thumb]:bg-[#12131C]',
    '[&_.adm-FloatingPanel-thumb]:rounded-full',
  ].join(' ')
);
