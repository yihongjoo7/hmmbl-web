'use client';
import { notification } from 'antd';
import Img from '../image/Img';
import { CustomToastVariants } from './CustomToast.styles';

export interface CustomToastProps {
  title?: string;
  titleIcon?: React.ReactNode;
  description: React.ReactNode;
  placement?: 'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight';
  closable?: boolean;
  closeBtnTxt?: string;
  mode?: 'toast' | 'snackbar';
  duration?: number;
  theme?: 'default' | 'success' | 'warning' | 'error'; // 필요시 추가
}

/**
 *
 * @param {
 *  style { // 컴포넌트 스타일에서 사용되는 props
 * 		title?: string; // title이 필요한 경우 추가
 *    titleIcon?: React.ReactNode; // title에 아이콘이 필요한 경우 추가
 * 		description: React.ReactNode; // toast or snackbar 안에 들어가는 children - string(snackbar)일 때 \n, <br/>, '.' 가 들어가면 2줄 처리
 * 		placement?: 'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight'; // toast or snackbar 위치 (default: bottom)
 *		closable?: boolean; // 닫기버튼 사용여부 (default: false(닫기버튼 없음))
 *		closeBtnTxt?: string; // 글자로 된 닫기버튼
 *		mode?: 'toast' | 'snackbar'; // toast or snackbar 사용가능(default snackbar)
 *		duration?: number; // Toast 유지시간 : 0 or null이면 자동으로 닫히지 않음 (default: 3)
 * 		theme?: 'default' | 'success' | 'warning' | 'error'; // 필요시 추가 (defult: deafault)
 *   }
 * }
 */
export const showToast = ({
  title,
  titleIcon,
  description,
  placement = 'bottom',
  closable = false,
  closeBtnTxt,
  mode = 'snackbar',
  duration = 3,
  theme = 'default',
}: CustomToastProps) => {
  if (mode === 'snackbar') {
    // snackbar인 경우 기존에 떠있는 모든 팝업 즉시 삭제(닫기)
    notification.destroy();
  }

  // 문자열인지 판단
  const IS_MESSAGE_STRING = typeof description === 'string';

  // 1줄/2줄 패딩 스타일 결정 - \n, <br/>, '.'이 있으면 2줄인 것으로 판단하는 정규식
  const IS_MULTI_REGEX = /(\.[^.]*\.)|(<\/?br\s*\/?>)|(\n)/i;
  const toastType = IS_MESSAGE_STRING && IS_MULTI_REGEX.test(description) ? 'multi' : 'single';

  // 줄바꿈을 위한 처리
  const CHECKED_BR_REGEX = /<\/?br\s*\/?>/gi;
  const CHECKED_DOT_REGEX = /\.(?!\d)(?!\s*$)\s*/g;
  const CLEAN_NEWLINE_REGEX = /\n\s+/g;
  const formattedDescription = IS_MESSAGE_STRING
    ? description
        .replace(CHECKED_BR_REGEX, '\n')
        .replace(CHECKED_DOT_REGEX, '.\n')
        .replace(CLEAN_NEWLINE_REGEX, '\n')
    : description;

  const closeIcon =
    closable && !!closeBtnTxt ? (
      <span className="text-white whitespace-nowrap">{closeBtnTxt}</span>
    ) : (
      <Img src={`/icons/common/ic_del_16.svg`} width={16} height={16} alt="close button icon" />
    );

  const formattedTitle = title ? (
    <div className="text-white">
      {titleIcon && <span>{titleIcon}</span>}
      <span>{title}</span>
    </div>
  ) : undefined;

  notification.open({
    className: CustomToastVariants({ lines: toastType, mode, theme }),
    title: formattedTitle,
    description: <div className="whitespace-pre-line text-white !m-0">{formattedDescription}</div>,
    closable,
    closeIcon,
    placement,
    duration,
  });
};
