/**
 * [퍼블리셔] 약관동의 목록·상세
 */

interface Term {
  id: string;
  title: string;
  required: boolean;
  content?: string;
  agreed: boolean;
}

interface TermsAgreementProps {
  terms: Term[];
  onAgree: (id: string, agreed: boolean) => void;
  expandedId?: string | null;
  onExpand?: (id: string | null) => void;
}

export function TermsAgreement({ terms, onAgree, expandedId, onExpand }: TermsAgreementProps) {
  return (
    <div className="flex flex-col divide-y divide-gray-100">
      {terms.map(term => (
        <div key={term.id} className="py-3">
          <div className="flex items-center gap-3">
            <input type="checkbox" checked={term.agreed}
              onChange={e => onAgree(term.id, e.target.checked)} className="w-4 h-4 accent-blue-600" />
            <button onClick={() => onExpand?.(expandedId === term.id ? null : term.id)}
              className="flex-1 text-left text-sm font-medium text-gray-700">
              {term.required ? '[필수] ' : '[선택] '}{term.title}
            </button>
            {term.content && (
              <span className="text-xs text-gray-400">{expandedId === term.id ? '▲' : '▼'}</span>
            )}
          </div>
          {expandedId === term.id && term.content && (
            <div className="mt-2 ml-7 p-3 bg-gray-50 rounded text-xs text-gray-500 leading-relaxed">
              {term.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
