import Link from 'next/link';
import { notFound } from 'next/navigation';
import { IA_DATA } from '../../_data/ia';

export default async function IaDepth1Page({ params }: { params: Promise<{ section: string; depth1: string }> }) {
  const { section: sectionId, depth1: depth1Id } = await params;
  const section = IA_DATA.find((s) => s.id === sectionId);
  const item = section?.children.find((c) => c.id === depth1Id);
  if (!section || !item) notFound();

  return (
    <div className="flex flex-col gap-6">
      {/* 브레드크럼 */}
      <div className="flex items-center gap-2">
        <Link href="/dev/ia" className="text-gray-400 hover:text-gray-700 text-sm">IA</Link>
        <span className="text-gray-300">/</span>
        <Link href={`/dev/ia/${section.id}`} className="text-gray-400 hover:text-gray-700 text-sm">{section.label}</Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">{item.label}</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {item.children.map((depth2) =>
          depth2.path ? (
            // path 있음 — 실제 앱 경로로 이동 가능
            <Link
              key={depth2.id}
              href={depth2.path}
              className="p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <p className="font-medium text-gray-800">{depth2.label}</p>
              <p className="text-xs text-blue-500 mt-1 truncate">{depth2.path}</p>
            </Link>
          ) : (
            // pattern만 있음 — 동적 라우트, 실제 ID 없이 탐색 불가
            <div
              key={depth2.id}
              className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200"
            >
              <p className="font-medium text-gray-500">{depth2.label}</p>
              <p className="text-xs text-gray-400 mt-1 truncate">{depth2.pattern}</p>
              <p className="text-xs text-gray-300 mt-1">동적 라우트 — ID 필요</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
