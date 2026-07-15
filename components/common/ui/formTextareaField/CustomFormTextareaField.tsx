import React from 'react';
import { Form } from 'antd';
import { VariantProps } from 'class-variance-authority';
import { CustomTextarea, CustomTextareaProps } from '../textarea/CustomTextarea';
import { FormTextareaFieldVariants } from './CustomFormTextareaField.styles';
type AntdFormItemProps = React.ComponentProps<typeof Form.Item>;

interface FormTextareaFieldProps
  extends AntdFormItemProps, VariantProps<typeof FormTextareaFieldVariants> {
  TextareaSize?: CustomTextareaProps['size'];
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  value?: string;
  type?: string;
}

export const CustomFormTextareaField = ({
  name,
  label,
  rules,

  placeholder,
  disabled,
  readOnly,
  className,
  value,
  type,
  required,
  ...formItemProps
}: FormTextareaFieldProps) => {
  // cva 스타일 결합
  const combinedClassName = FormTextareaFieldVariants({
    className,
  });

  // rules 내부의 필수값 설정 여부
  const isRequired =
    required ||
    (Array.isArray(rules) &&
      rules.some(
        (rule) => typeof rule === 'object' && rule !== null && 'required' in rule && rule.required
      ));

  const hasFormContext = name !== undefined;

  return (
    <Form.Item
      labelCol={{ span: 24 }} // label size full
      wrapperCol={{ span: 24 }} // Textarea size full
      layout="horizontal"
      {...formItemProps}
      name={hasFormContext ? name : undefined}
      label={label}
      rules={hasFormContext ? rules : undefined}
      required={isRequired}
      className={`${combinedClassName} ${readOnly ? 'is-readonly' : ''} ${disabled ? 'is-disabled' : ''}`}
    >
      <CustomTextarea
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        type={type}
        {...(!hasFormContext || value !== undefined ? { value } : {})}
      />
    </Form.Item>
  );
};

(CustomFormTextareaField as any).displayName = 'FormItem';
