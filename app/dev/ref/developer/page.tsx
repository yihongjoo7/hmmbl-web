import fs from 'fs';
import path from 'path';
import { FileTabs } from '../_components/FileTabs';

export default function DeveloperRefPage() {
  const base = path.join(process.cwd(), 'features/_templates');

  const tabs = [
    {
      label: 'ExamplePage.tsx',
      filename: 'ExamplePage.tsx',
      content: fs.readFileSync(path.join(base, 'ExamplePage.tsx'), 'utf-8'),
    },
    {
      label: 'useExampleList.ts',
      filename: 'hooks/useExampleList.ts',
      content: fs.readFileSync(path.join(base, 'hooks/useExampleList.ts'), 'utf-8'),
    },
    {
      label: 'useExampleDetail.ts',
      filename: 'hooks/useExampleDetail.ts',
      content: fs.readFileSync(path.join(base, 'hooks/useExampleDetail.ts'), 'utf-8'),
    },
    {
      label: 'useExampleMutation.ts',
      filename: 'hooks/useExampleMutation.ts',
      content: fs.readFileSync(path.join(base, 'hooks/useExampleMutation.ts'), 'utf-8'),
    },
    {
      label: 'exampleApi.ts',
      filename: 'services/exampleApi.ts',
      content: fs.readFileSync(path.join(base, 'services/exampleApi.ts'), 'utf-8'),
    },
    {
      label: 'types/index.ts',
      filename: 'types/index.ts',
      content: fs.readFileSync(path.join(base, 'types/index.ts'), 'utf-8'),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">DEVELOPER</span>
          <h1 className="text-xl font-bold text-gray-900">개발자 레퍼런스</h1>
        </div>
        <p className="text-sm text-gray-500">
          Page · 훅 · 서비스 · 타입 파일 작성 패턴. 탭으로 파일을 전환하고 📋 복사 후 사용하세요.
        </p>
        <ul className="mt-2 flex flex-col gap-1 text-xs text-gray-400">
          <li>📄 <strong>ExamplePage</strong> — 훅 연결 + 핸들러 + View 에 props 전달</li>
          <li>📄 <strong>useExampleList</strong> — useQuery / useInfiniteQuery + queryKey 팩토리</li>
          <li>📄 <strong>useExampleDetail</strong> — enabled 옵션, 단건 조회</li>
          <li>📄 <strong>useExampleMutation</strong> — useMutation, invalidate, optimistic update</li>
          <li>📄 <strong>exampleApi</strong> — apiClient 호출 + 엔드포인트 상수</li>
          <li>📄 <strong>types/index</strong> — 도메인 타입, API 응답 래퍼 타입</li>
        </ul>
      </div>
      <FileTabs tabs={tabs} />
    </div>
  );
}
