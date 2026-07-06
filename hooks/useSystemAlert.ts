/**
 * 전역 시스템 알림 다이얼로그 (Zustand)
 * alert(확인만)/confirm(확인·취소)을 modal 필드 하나로 관리한다. 동시에 하나만 표시된다.
 */
import { create } from 'zustand';

export interface SystemAlertOptions {
  type:          'alert' | 'confirm';
  title?:        string;
  message?:      string;
  icon?:         string;
  confirmLabel?: string;
  cancelLabel?:  string;
  onConfirm?:    () => void;
  onCancel?:     () => void;
}

interface SystemAlertState {
  modal:   SystemAlertOptions | null;
  alert:   (opts: Omit<SystemAlertOptions, 'type'>) => void;
  confirm: (opts: Omit<SystemAlertOptions, 'type'>) => void;
  close:   () => void;
}

export const useSystemAlert = create<SystemAlertState>((set) => ({
  modal:   null,
  alert:   (opts) => set({ modal: { ...opts, type: 'alert'   } }),
  confirm: (opts) => set({ modal: { ...opts, type: 'confirm' } }),
  close:   () => set({ modal: null }),
}));
