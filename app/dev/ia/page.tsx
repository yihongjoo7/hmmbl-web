import Link from 'next/link';
import { IA_DATA } from './_data/ia';

export default function IaPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">IA 네비게이터</h1>
        <p className="text-sm text-gray-500 mt-1">섹션을 선택해 화면으로 이동합니다.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {IA_DATA.map((section) => (
          <Link
            key={section.id}
            href={`/dev/ia/${section.id}`}
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <span className="font-medium text-gray-800">{section.label}</span>
            <span className="text-gray-400 text-sm">{section.children.length}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
