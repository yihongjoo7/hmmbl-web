import Link from 'next/link';
import { notFound } from 'next/navigation';
import { IA_DATA } from '../_data/ia';

export default async function IaSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section: sectionId } = await params;
  const section = IA_DATA.find((s) => s.id === sectionId);
  if (!section) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Link href="/dev/ia" className="text-gray-400 hover:text-gray-700 text-sm">IA</Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">{section.label}</h1>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {section.children.map((depth1) => (
          <Link
            key={depth1.id}
            // children이 있으면 서브 목록 페이지로, 없으면 실제 앱 경로로 이동
            href={depth1.children.length > 0 ? `/dev/ia/${section.id}/${depth1.id}` : (depth1.path ?? '#')}
            className="p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium text-gray-800">{depth1.label}</p>
              {/* 하위 경로 수 표시 */}
              {depth1.children.length > 0 && (
                <span className="text-xs text-gray-400 shrink-0">{depth1.children.length}개 ›</span>
              )}
            </div>
            {depth1.path && (
              <p className="text-xs text-blue-500 mt-1 truncate">{depth1.path}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
