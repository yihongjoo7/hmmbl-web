'use client';
import { useToastStore } from '@/hooks/useToastStore';
import { Button } from '@/components/common/ui/action/Button';

export default function ToastDevPage() {
  const addToast = useToastStore((s) => s.addToast);
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Toast</h1>
      <div className="flex gap-3 flex-wrap">
        <Button onClick={() => addToast('성공 메시지', 'success')}>Success</Button>
        <Button variant="danger" onClick={() => addToast('오류 메시지', 'error')}>Error</Button>
        <Button variant="outline" onClick={() => addToast('경고 메시지', 'warning')}>Warning</Button>
        <Button variant="ghost" onClick={() => addToast('안내 메시지', 'info')}>Info</Button>
      </div>
    </div>
  );
}
