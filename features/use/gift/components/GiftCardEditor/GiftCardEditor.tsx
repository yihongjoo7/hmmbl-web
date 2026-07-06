/** [퍼블리셔] 카드 꾸미기 에디터 (3단계) */
interface GiftCardEditorProps { template?: string; message?: string; onTemplateChange?: (t: string) => void; onMessageChange?: (m: string) => void; }
export function GiftCardEditor({ message = '', onMessageChange }: GiftCardEditorProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="w-full aspect-video bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl flex items-center justify-center"><p className="text-center text-gray-600 italic px-4">{message || '메시지를 입력하세요'}</p></div>
      <textarea value={message} onChange={e => onMessageChange?.(e.target.value)} rows={3} maxLength={100}
        className="w-full border rounded-xl p-3 text-sm resize-none" placeholder="마음을 담은 메시지를 입력하세요 (최대 100자)" />
    </div>
  );
}
