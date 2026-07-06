'use client';

/**
 * features/shared/components/CopyButton/CopyButton.tsx
 *
 * 클립보드 복사 버튼 컴포넌트
 *
 * 복사 성공 시 2초 동안 "복사됨" 상태를 표시한다.
 * showToast=true 이면 토스트 알림도 함께 표시한다.
 *
 * 사용법:
 *   <CopyButton text="https://myapp.com/share/123" showToast />
 *   <CopyButton text={inviteCode} label="코드 복사" copiedLabel="복사됨!" />
 */

import { useCallback } from 'react';
import { useCopyToClipboard } from '@/features/shared/hooks/useCopyToClipboard';
import styles from './CopyButton.module.css';

interface CopyButtonProps {
  /** 복사할 텍스트 */
  text: string;
  /** 버튼 기본 레이블 (기본값: '복사') */
  label?: string;
  /** 복사 완료 레이블 (기본값: '복사됨!') */
  copiedLabel?: string;
  /** 복사 성공 시 토스트 알림 표시 여부 */
  showToast?: boolean;
  className?: string;
}

export function CopyButton({
  text,
  label      = '복사',
  copiedLabel = '복사됨!',
  showToast  = false,
  className,
}: CopyButtonProps) {
  const { copy, isCopied } = useCopyToClipboard();

  const handleClick = useCallback(async () => {
    const success = await copy(text);
    if (success && showToast) {
      // 토스트 표시: 프로젝트의 toast 유틸을 직접 사용하거나
      // 상위에서 onSuccess 콜백으로 처리할 수 있다.
      // 현재는 console.log로 대체 (프로젝트 toast 연동 시 교체)
      console.log('[CopyButton] 클립보드에 복사되었습니다.');
    }
  }, [copy, text, showToast]);

  return (
    <button
      className={`${styles.button} ${isCopied ? styles.copied : ''} ${className ?? ''}`}
      onClick={handleClick}
      aria-label={isCopied ? '복사됨' : `${label}: ${text}`}
      type="button"
    >
      {/* 아이콘: 복사 여부에 따라 전환 */}
      <span className={styles.icon} aria-hidden="true">
        {isCopied ? '✓' : '⎘'}
      </span>
      {/* 레이블 텍스트 */}
      <span>{isCopied ? copiedLabel : label}</span>
    </button>
  );
}
