import { IMG_QUIZ_PATH, QUIZ_TOAST_COMMENT } from '@/app/dev/pub/rwd/qiz/mock';
import { showToast } from '@/components/common/ui';
import Img from '@/components/common/ui/image/Img';
import CustomSwitch, { CustomSwitchProps } from '@/components/common/ui/switch/CustomSwitch';
import { notification } from 'antd';
import { useState } from 'react';

export default function QuizToggle() {
  const customSwitchProps: CustomSwitchProps = {
    size: 'sm',
  };

  const [isOnChanged, setIsOnChanged] = useState(false);

  const onClickHandler = () => {
    const toggleNextState = !isOnChanged;
    setIsOnChanged(toggleNextState);

    if (toggleNextState) {
      showToast({
        description: QUIZ_TOAST_COMMENT.quizAlarm,
      });
    } else {
      notification.destroy();
    }
  };

  return (
    <div className="flex items-center justify-center py-6 cursor-pointer" onClick={onClickHandler}>
      <Img src={`${IMG_QUIZ_PATH}/quiz-alarm.svg`} width={20} height={20} alt="알람 종 이미지" />
      <span className="pl-1 pr-2 text-sm font-bold">퀴즈 오픈 시 알림 받기</span>
      <CustomSwitch
        size="sm"
        checked={isOnChanged}
        className="pointer-events-none"
        {...customSwitchProps}
      />
    </div>
  );
}
