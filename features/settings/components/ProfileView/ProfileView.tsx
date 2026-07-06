/** [퍼블리셔] 개인정보변경 화면 레이아웃 */
interface Profile { name: string; phone: string; email: string; }
export function ProfileView({ profile, isLoading, onUpdate }: { profile?: Profile; isLoading?: boolean; onUpdate?: (data: Partial<Profile>) => void }) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  const p = profile ?? { name: '', phone: '', email: '' };
  return (
    <div className="flex flex-col gap-6 p-6 pb-24">
      <h1 className="text-xl font-bold">개인정보변경</h1>
      <div className="flex flex-col gap-4">
        {[{ label: '이름', key: 'name', value: p.name, type: 'text' }, { label: '휴대폰 번호', key: 'phone', value: p.phone, type: 'tel' }, { label: '이메일', key: 'email', value: p.email, type: 'email' }].map(f => (
          <div key={f.key} className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">{f.label}</label>
            <input defaultValue={f.value} type={f.type} className="border rounded-xl px-4 py-3 text-sm" />
          </div>
        ))}
      </div>
      <button onClick={() => onUpdate?.({})} className="fixed bottom-6 left-6 right-6 py-4 bg-blue-600 text-white rounded-xl font-bold">변경하기</button>
    </div>
  );
}
