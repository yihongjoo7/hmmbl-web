/** [퍼블리셔] 개인정보변경 폼 (이름·휴대폰·이메일) */
interface ProfileEditFormProps { name?: string; phone?: string; email?: string; onChange?: (field: string, value: string) => void; onSubmit?: () => void; isLoading?: boolean; }
export function ProfileEditForm({ name = '', phone = '', email = '', onChange, onSubmit, isLoading }: ProfileEditFormProps) {
  return (
    <div className="flex flex-col gap-4">
      {[{ label: '이름', key: 'name', value: name, type: 'text', placeholder: '이름을 입력하세요' }, { label: '휴대폰 번호', key: 'phone', value: phone, type: 'tel', placeholder: '010-0000-0000' }, { label: '이메일', key: 'email', value: email, type: 'email', placeholder: 'example@email.com' }].map(f => (
        <div key={f.key} className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">{f.label}</label>
          <input value={f.value} type={f.type} placeholder={f.placeholder} onChange={e => onChange?.(f.key, e.target.value)} className="border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500" />
        </div>
      ))}
      <button onClick={onSubmit} disabled={isLoading} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold mt-2 disabled:opacity-50">{isLoading ? '저장 중...' : '저장하기'}</button>
    </div>
  );
}
