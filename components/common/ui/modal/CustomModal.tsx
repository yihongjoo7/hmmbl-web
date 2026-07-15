import React from 'react';
import { Modal as AntdModal } from 'antd';
import { VariantProps } from 'class-variance-authority';
import { ModalVariants } from './CustomModal.styles';

export interface CustomModalProps extends VariantProps<typeof ModalVariants> {
  children: React.ReactNode;
  visible?: boolean;
  onClose?: () => void;
  closeOnMaskClick?: boolean;
  className?: string;
  afterClose?: () => void;
  destroyOnClose?: boolean;
}

export const CustomModal = ({
  children,
  className,
  visible,
  onClose,
  closeOnMaskClick,
  afterClose,
  destroyOnClose,
}: CustomModalProps) => {
  const combinedClassName = ModalVariants({ className });
  return (
    <AntdModal
      open={visible}
      onCancel={onClose}
      mask={{ closable: closeOnMaskClick }}
      afterClose={afterClose}
      destroyOnHidden={destroyOnClose}
      footer={null}
      closable={false}
      centered
      styles={{ mask: { background: 'rgba(0, 0, 0, 0.8)' } }}
      className={String(combinedClassName)}
    >
      {children}
    </AntdModal>
  );
};
