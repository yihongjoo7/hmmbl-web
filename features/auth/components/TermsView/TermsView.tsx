/**
 * [퍼블리셔] 약관동의 화면 레이아웃
 * props → 렌더링만 담당.
 */

interface Term {
  id: string;
  title: string;
  required: boolean;
  agreed: boolean;
}

interface TermsViewProps {
  terms: Term[];
  onAgree: (id: string, agreed: boolean) => void;
  onAgreeAll: (agreed: boolean) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  canSubmit?: boolean;
}

export function TermsView({ terms, onAgree, onAgreeAll, onSubmit, isLoading, canSubmit }: TermsViewProps) {
  const allAgreed = terms.every(t => t.agreed);

  return (
    <div className="flex flex-col gap-4 px-6 pt-8 pb-24">
      <h1 className="text-xl font-bold">약관동의</h1>
      <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer">
        <input type="checkbox" checked={allAgreed} onChange={e => onAgreeAll(e.target.checked)} className="w-5 h-5" />
        <span className="font-medium">전체 동의</span>
      </label>
      <div className="flex flex-col gap-2">
        {terms.map(t => (
          <label key={t.id} className="flex items-center gap-3 p-3 cursor-pointer">
            <input type="checkbox" checked={t.agreed} onChange={e => onAgree(t.id, e.target.checked)} className="w-4 h-4" />
            <span className="text-sm">{t.required ? '[필수] ' : '[선택] '}{t.title}</span>
          </label>
        ))}
      </div>
      <button onClick={onSubmit} disabled={!canSubmit || isLoading}
        className="fixed bottom-6 left-6 right-6 py-3 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50">
        {isLoading ? '처리 중...' : '동의하고 시작하기'}
      </button>
    </div>
  );
}
