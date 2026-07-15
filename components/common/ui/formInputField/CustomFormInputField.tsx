import React from 'react';
import { Form } from 'antd';
import { VariantProps } from 'class-variance-authority';
import { CustomInput, CustomInputProps } from '../input/CustomInput';
import { FormInputFieldVariants } from './CustomFormInputField.styles';

type AntdFormItemProps = React.ComponentProps<typeof Form.Item>;

interface FormInputFieldProps
  extends AntdFormItemProps, VariantProps<typeof FormInputFieldVariants> {
  inputSize?: CustomInputProps['size'];
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  value?: string;
  type?: string;
}

export const CustomFormInputField = ({
  name,
  label,
  rules,
  size = 'md',
  placeholder,
  disabled,
  readOnly,
  className,
  value,
  type,
  required,
  ...formItemProps
}: FormInputFieldProps) => {
  // cva 스타일 결합
  const combinedClassName = FormInputFieldVariants({
    className,
    size,
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
      wrapperCol={{ span: 24 }} // input size full
      layout="horizontal"
      {...formItemProps}
      name={hasFormContext ? name : undefined}
      label={label}
      rules={hasFormContext ? rules : undefined}
      required={isRequired}
      className={`${combinedClassName} ${readOnly ? 'is-readonly' : ''}`}
    >
      <CustomInput
        size={size}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        type={type}
        {...(!hasFormContext || value !== undefined ? { value } : {})}
      />
    </Form.Item>
  );
};

(CustomFormInputField as any).displayName = 'FormItem';
