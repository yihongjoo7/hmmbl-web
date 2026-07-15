import { cva } from 'class-variance-authority';

export const segmentedVariants = cva('p-[1px] rounded-full text-xs border border-outline-300', {
  variants: {
    variant: {
      default: [
        '[&_.ant-segmented-item-label]:tracking-[-0.04em]',
        '[&_.ant-segmented-item-label]:px-[20px]',
        '[&_.ant-segmented-item-label]:py-[4px]',
        '[&_.ant-segmented-item-label]:transition-colors',
        '[&_.ant-segmented-item-label]:duration-100',
        '[&_.ant-segmented-item-label]:rounded-full',
        '[&_.ant-segmented-item.ant-segmented-item-selected]:!bg-[#12131C]',
        '[&_.ant-segmented-item.ant-segmented-item-selected]:rounded-full',
        '[&_.ant-segmented-item.ant-segmented-item-selected_.ant-segmented-item-label]:!bg-[#12131C]',
        '[&_.ant-segmented-item.ant-segmented-item-selected_.ant-segmented-item-label]:!text-white',
        '[&_.ant-segmented-item.ant-segmented-item-selected_.ant-segmented-item-label]:rounded-full',
        '[&_.ant-segmented-thumb]:!bg-[#12131C]',
        '[&_.ant-segmented-thumb]:rounded-full',
      ],
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});
