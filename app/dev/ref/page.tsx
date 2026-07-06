import Link from 'next/link';

const CARDS = [
  {
    href: '/dev/ref/publisher',
    previewHref: '/dev/ref/preview',
    icon: '🎨',
    badge: 'PUBLISHER',
    badgeColor: 'bg-pink-100 text-pink-700',
    title: '퍼블리셔 레퍼런스',
    desc: 'View 컴포넌트 작성 패턴. props 인터페이스, 로딩·빈·에러 상태, Tailwind 레이아웃, 체크리스트.',
    files: ['ExampleView.tsx'],
  },
  {
    href: '/dev/ref/developer',
    previewHref: '/dev/ref/preview',
    icon: '⚙️',
    badge: 'DEVELOPER',
    badgeColor: 'bg-blue-100 text-blue-700',
    title: '개발자 레퍼런스',
    desc: 'Page 컨테이너, React Query 훅(list/detail/mutation), API 서비스, 도메인 타입 작성 패턴.',
    files: ['ExamplePage.tsx', 'hooks/useExampleList.ts', 'hooks/useExampleDetail.ts', 'hooks/useExampleMutation.ts', 'services/exampleApi.ts', 'types/index.ts'],
  },
];

export default function RefIndexPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">코드 레퍼런스</h1>
        <p className="text-sm text-gray-500 mt-1">
          퍼블리셔·개발자 각 역할별 파일 작성 패턴과 주석 가이드입니다.
          <br />
          실제 파일은{' '}
          <code className="bg-gray-100 px-1 rounded text-xs">features/_templates/</code>
          에 있습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CARDS.map((card) => (
          <div
            key={card.href}
            className="flex flex-col gap-3 p-5 bg-white rounded-xl border border-gray-200"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{card.icon}</span>
              <div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${card.badgeColor}`}>
                  {card.badge}
                </span>
                <h2 className="text-base font-bold text-gray-900 mt-0.5">{card.title}</h2>
              </div>
            </div>
            <p className="text-sm text-gray-500">{card.desc}</p>
            <div className="flex flex-col gap-1">
              {card.files.map((f) => (
                <span key={f} className="text-[11px] font-mono text-gray-400">
                  📄 {f}
                </span>
              ))}
            </div>
            <div className="flex gap-2 mt-1">
              <Link
                href={card.href}
                className="flex-1 py-2 text-center text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                📄 코드 보기
              </Link>
              <Link
                href={card.previewHref}
                className="flex-1 py-2 text-center text-xs font-medium rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors"
              >
                📱 화면 보기
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
