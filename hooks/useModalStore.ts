/**
 * 전역 모달 열림/닫힘 상태 (Zustand)
 * ID 기반으로 관리하므로 여러 모달이 동시에 독립적으로 열릴 수 있다.
 */
import { create } from 'zustand';

interface ModalState {
  openIds: string[];
  open:    (id: string) => void;
  close:   (id: string) => void;
  isOpen:  (id: string) => boolean;
}

export const useModalStore = create<ModalState>((set, get) => ({
  openIds: [],
  open:   (id) => set((s) => ({ openIds: [...s.openIds, id] })),
  close:  (id) => set((s) => ({ openIds: s.openIds.filter((i) => i !== id) })),
  isOpen: (id) => get().openIds.includes(id),
}));
