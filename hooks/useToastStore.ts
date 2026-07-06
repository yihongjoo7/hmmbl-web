/**
 * 전역 Toast 메시지 큐 (Zustand)
 * addToast로 메시지를 추가하면 화면 어딘가의 Toast 렌더러가 toasts 배열을 구독해 표시한다.
 */
import { create } from 'zustand';

export interface Toast {
  id:        string;
  message:   string;
  type:      'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface ToastState {
  toasts:      Toast[];
  addToast:    (message: string, type: Toast['type'], duration?: number) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, type, duration = 3000) =>
    set((s) => ({
      toasts: [...s.toasts, { id: crypto.randomUUID(), message, type, duration }],
    })),
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
