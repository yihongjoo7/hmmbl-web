import React from 'react';
import { Modal as AntdModal } from 'antd';
import { VariantProps } from 'class-variance-authority';
import { DialogVariants } from './CustomDialog.styles';

export interface DialogActionItem {
  key: string;
  text: string;
  bold?: boolean;
  danger?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export interface CustomDialogProps extends VariantProps<typeof DialogVariants> {
  visible?: boolean;
  title?: React.ReactNode;
  content?: React.ReactNode;
  actions?: DialogActionItem[][];
  closeOnMaskClick?: boolean;
  onClose?: () => void;
  className?: string;
}

export const CustomDialog = ({
  className,
  visible,
  title,
  content,
  actions,
  closeOnMaskClick,
  onClose,
}: CustomDialogProps) => {
  const combinedClassName = DialogVariants({ className });

  return (
    <AntdModal
      open={visible}
      onCancel={onClose}
      mask={{ closable: closeOnMaskClick }}
      centered
      closable={false}
      title={title}
      styles={{ mask: { background: 'rgba(0, 0, 0, 0.8)' } }}
      className={combinedClassName}
      footer={
        actions && actions.length > 0
          ? actions.map((row, rowIndex) => (
              <div key={rowIndex} className="dialog-action-row">
                {row.map((action) => (
                  <button
                    key={action.key}
                    type="button"
                    disabled={action.disabled}
                    onClick={action.onClick}
                    className={`dialog-action-button ${action.bold ? 'font-bold' : ''} ${
                      action.danger ? '!text-system-error-500' : ''
                    }`}
                  >
                    {action.text}
                  </button>
                ))}
              </div>
            ))
          : null
      }
    >
      {content}
    </AntdModal>
  );
};
