'use client';
/**
 * IA 공통 Alert·팝업 (시스템 전용)
 *
 * useSystemAlert 훅과 연동해 전역 Alert/Confirm 다이얼로그를 렌더링합니다.
 * app/layout.tsx 또는 (protected)/layout.tsx에 한 번만 마운트하세요.
 *
 * 사용 예시:
 *   const { alert, confirm } = useSystemAlert();
 *   alert({ title: '알림', message: '저장되었습니다.' });
 *   confirm({ title: '삭제', message: '정말 삭제하시겠어요?', onConfirm: () => deleteItem() });
 */

import { useSystemAlert } from '@/hooks/useSystemAlert';

export function SystemAlert() {
  const { modal, close } = useSystemAlert();

  if (!modal) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/50" onClick={modal.type === 'alert' ? close : undefined} />
      <div className="relative w-full max-w-xs bg-white rounded-2xl overflow-hidden shadow-xl">
        {(modal.title || modal.icon) && (
          <div className="pt-6 pb-2 px-6 text-center">
            {modal.icon    && <p className="text-4xl mb-2">{modal.icon}</p>}
            {modal.title   && <h2 className="text-base font-bold text-gray-900">{modal.title}</h2>}
          </div>
        )}
        {modal.message && (
          <p className="px-6 py-3 text-sm text-gray-500 text-center leading-relaxed whitespace-pre-line">{modal.message}</p>
        )}
        <div className={`flex border-t mt-2 ${modal.type === 'confirm' ? 'divide-x' : ''}`}>
          {modal.type === 'confirm' && (
            <button onClick={() => { modal.onCancel?.(); close(); }} className="flex-1 py-4 text-sm font-medium text-gray-500 hover:bg-gray-50">
              {modal.cancelLabel ?? '취소'}
            </button>
          )}
          <button onClick={() => { modal.onConfirm?.(); close(); }} className="flex-1 py-4 text-sm font-bold text-blue-600 hover:bg-blue-50">
            {modal.confirmLabel ?? '확인'}
          </button>
        </div>
      </div>
    </div>
  );
}
