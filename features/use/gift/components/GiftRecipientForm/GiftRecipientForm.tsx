/** [퍼블리셔] 선물 수신자 정보 입력 */
interface GiftRecipientFormProps { phone?: string; name?: string; onPhoneChange?: (v: string) => void; onNameChange?: (v: string) => void; }
export function GiftRecipientForm({ phone = '', name = '', onPhoneChange, onNameChange }: GiftRecipientFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1"><label className="text-sm font-medium text-gray-700">받는 분 이름</label><input value={name} onChange={e => onNameChange?.(e.target.value)} className="border rounded-xl px-4 py-3 text-sm" placeholder="이름 입력" /></div>
      <div className="flex flex-col gap-1"><label className="text-sm font-medium text-gray-700">휴대폰 번호</label><input value={phone} onChange={e => onPhoneChange?.(e.target.value)} className="border rounded-xl px-4 py-3 text-sm" placeholder="010-0000-0000" /></div>
    </div>
  );
}
