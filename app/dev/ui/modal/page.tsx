'use client';
import { Modal }         from '@/components/common/ui/overlay/Modal';
import { ConfirmDialog } from '@/components/common/ui/overlay/ConfirmDialog';
import { BottomSheet }   from '@/components/common/ui/overlay/BottomSheet';
import { Button }        from '@/components/common/ui/action/Button';
import { useModalStore } from '@/hooks/useModalStore';
import { useState }      from 'react';

const MODAL_ID = 'dev-modal';

export default function ModalDevPage() {
  const { open: openModal, close } = useModalStore();
  const [confirm, setConfirm]      = useState(false);
  const [sheet,   setSheet]        = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Overlay Components</h1>
      <div className="flex gap-3">
        <Button onClick={() => openModal(MODAL_ID)}>Modal</Button>
        <Button variant="outline" onClick={() => setConfirm(true)}>ConfirmDialog</Button>
        <Button variant="secondary" onClick={() => setSheet(true)}>BottomSheet</Button>
      </div>

      <Modal id={MODAL_ID} title="모달 제목">
        <p className="text-sm text-gray-600">모달 콘텐츠입니다.</p>
        <div className="mt-4 flex justify-end">
          <Button size="sm" onClick={() => close(MODAL_ID)}>닫기</Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirm}
        title="확인"
        message="정말 실행하시겠습니까?"
        onConfirm={() => setConfirm(false)}
        onCancel={() => setConfirm(false)}
      />

      <BottomSheet open={sheet} onClose={() => setSheet(false)} title="바텀시트">
        <p className="text-sm text-gray-600">바텀시트 콘텐츠입니다.</p>
      </BottomSheet>
    </div>
  );
}
