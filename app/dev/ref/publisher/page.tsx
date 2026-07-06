import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { FileTabs } from '../_components/FileTabs';

export default function PublisherRefPage() {
  const base = path.join(process.cwd(), 'features/_templates');

  const tabs = [
    {
      label: 'ExampleView.tsx',
      filename: 'ExampleView.tsx',
      content: fs.readFileSync(path.join(base, 'ExampleView.tsx'), 'utf-8'),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-pink-100 text-pink-700">PUBLISHER</span>
          <h1 className="text-xl font-bold text-gray-900">퍼블리셔 레퍼런스</h1>
        </div>
        <p className="text-sm text-gray-500">
          View 컴포넌트 작성 패턴. 이 파일을 복사해 실제{' '}
          <code className="bg-gray-100 px-1 rounded">*View.tsx</code> 작성 시 참고하세요.
        </p>
        <ul className="mt-2 flex flex-col gap-1 text-xs text-gray-400">
          <li>✅ Tailwind 유틸리티 클래스로 스타일링</li>
          <li>✅ props 를 통해서만 데이터 수신, 콜백은 optional</li>
          <li>✅ 로딩 / 빈 / 에러 상태 3종 필수 구현</li>
          <li>❌ useState·fetch·apiClient 사용 금지</li>
        </ul>
        <Link
          href="/dev/ref/preview"
          className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 rounded-lg bg-gray-900 text-white text-xs font-medium hover:bg-gray-700 transition-colors"
        >
          📱 실제 화면 보기
        </Link>
      </div>
      <FileTabs tabs={tabs} />
    </div>
  );
}
