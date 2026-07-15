import { Radio } from 'antd';
import { AnswerTrueFalseVariants } from './AnswerTrueFalse.styles';

// 이미지 - https에서 backgound로 image 호출 했을 때 차단되고 있어 import진행
import icYesSelected from '@/public/images/answer/ic_yes_selected.svg';
import icYesEnabled from '@/public/images/answer/ic_yes_enabled.svg';
import icYesOnpress from '@/public/images/answer/ic_yes_onpress.svg';
import icNoSelected from '@/public/images/answer/ic_no_selected.svg';
import icNoEnabled from '@/public/images/answer/ic_no_enabled.svg';
import icNoOnpress from '@/public/images/answer/ic_no_onpress.svg';

export type AnswerTrueFlaseType = 'yes' | 'no';
export interface AnswerTrueFalseProps {
  value?: AnswerTrueFlaseType | null;
  onChangeHandler: (value: AnswerTrueFlaseType) => void;
}

const yesImageStyles = {
  '--img-selected': `url(${icYesSelected.src})`,
  '--img-enabled': `url(${icYesEnabled.src})`,
  '--img-pressed': `url(${icYesOnpress.src})`,
} as React.CSSProperties;

const noImageStyles = {
  '--img-selected': `url(${icNoSelected.src})`,
  '--img-enabled': `url(${icNoEnabled.src})`,
  '--img-pressed': `url(${icNoOnpress.src})`,
} as React.CSSProperties;

export default function AnswerTrueFalseImgImport({ value, onChangeHandler }: AnswerTrueFalseProps) {
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
              ? 'bg-[image:var(--img-selected)]'
              : 'bg-[image:var(--img-enabled)] group-active:bg-[image:var(--img-pressed)]'
          }
        `}
          style={yesImageStyles}
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
                ? 'bg-[image:var(--img-selected)]'
                : 'bg-[image:var(--img-enabled)] group-active:bg-[image:var(--img-pressed)]'
            }
          `}
          style={noImageStyles}
        />
      </Radio>
    </div>
  );
}
