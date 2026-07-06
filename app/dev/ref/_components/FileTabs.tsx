'use client';

import { useState } from 'react';

export interface FileTab {
  label: string;
  filename: string;
  content: string;
}

export function FileTabs({ tabs }: { tabs: FileTab[] }) {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(tabs[active].content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex flex-col rounded-xl border border-gray-200 overflow-hidden bg-white">
      {/* 탭 헤더 */}
      <div className="flex items-center border-b border-gray-200 bg-gray-50 overflow-x-auto">
        <div className="flex flex-1 min-w-0">
          {tabs.map((tab, i) => (
            <button
              key={tab.filename}
              type="button"
              onClick={() => setActive(i)}
              className={[
                'shrink-0 px-4 py-2.5 text-xs font-mono border-r border-gray-200 transition-colors',
                i === active
                  ? 'bg-white text-gray-900 font-semibold border-b-2 border-b-blue-500 -mb-px'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100',
              ].join(' ')}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* 복사 버튼 */}
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 px-3 py-2 text-xs text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
        >
          {copied ? '✅ 복사됨' : '📋 복사'}
        </button>
      </div>

      {/* 파일 경로 */}
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
        <span className="text-[11px] font-mono text-gray-400">
          features/_templates/{tabs[active].filename}
        </span>
      </div>

      {/* 코드 */}
      <pre className="overflow-auto p-4 text-xs font-mono leading-relaxed text-gray-800 bg-white max-h-[68vh]">
        <code>{tabs[active].content}</code>
      </pre>
    </div>
  );
}
