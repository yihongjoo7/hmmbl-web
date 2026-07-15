import { Radio } from 'antd';
import { AnswerTrueFalseVariants } from './AnswerTrueFalse.styles';

export type AnswerTrueFlaseType = 'yes' | 'no';
export interface AnswerTrueFalseProps {
  value?: AnswerTrueFlaseType | null;
  onChangeHandler: (value: AnswerTrueFlaseType) => void;
}

export default function AnswerTrueFalse({ value, onChangeHandler }: AnswerTrueFalseProps) {
  return (
    <div className="flex w-full gap-5">
      <Radio
        className={AnswerTrueFalseVariants({ checked: value === 'yes' })}
        checked={value === 'yes'}
        onChange={() => onChangeHandler('yes')}
      >
        <span
          className={`block w-[60px] h-[60px]
            bg-center bg-contain bg-no-repeat
          ${
            value === 'yes'
              ? "bg-[url('/images/answer/ic_yes_selected.svg')]"
              : "bg-[url('/images/answer/ic_yes_enabled.svg')] group-active:bg-[url('/images/answer/ic_yes_onpress.svg')]"
          }
        `}
        />
      </Radio>
      <Radio
        className={AnswerTrueFalseVariants({ checked: value === 'no' })}
        checked={value === 'no'}
        onChange={() => onChangeHandler('no')}
      >
        <span
          className={`block w-[60px] h-[60px]
            bg-center bg-contain bg-no-repeat
            ${
              value === 'no'
                ? "bg-[url('/images/answer/ic_no_selected.svg')]"
                : "bg-[url('/images/answer/ic_no_enabled.svg')] group-active:bg-[url('/images/answer/ic_no_onpress.svg')]"
            }
          `}
        />
      </Radio>
    </div>
  );
}
