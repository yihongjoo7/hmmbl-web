import Link from 'next/link';

const SECTIONS = [
  { href: '/dev/ia', icon: '🗺️', title: 'IA 네비게이터', desc: '섹션 → 1depth → 2depth 계층 탐색으로 모든 화면에 바로 접근합니다.', items: ['공통', '메인', '적립', '사용', '결제', 'MY', '설정', '하단'] },
  { href: '/dev/pub', icon: '🎨', title: '퍼블리셔 화면', desc: '퍼블리셔가 작업한 화면을 목업 데이터로 미리 확인합니다.', items: ['쿠폰 목록', '미션 목록', '이벤트 목록'] },
  { href: '/dev/ref', icon: '📖', title: '코드 레퍼런스', desc: '퍼블리셔·개발자 역할별 파일 작성 패턴과 주석 가이드입니다.', items: ['ExampleView (퍼블리셔)', 'ExamplePage (개발자)', 'useQuery / useMutation', 'apiClient 패턴'] },
  { href: '/dev/ui', icon: '🧩', title: 'UI 컴포넌트 카탈로그', desc: '공통 UI 컴포넌트와 디자인 토큰을 확인합니다.', items: ['Button', 'Input', 'Modal', 'Toast', 'Badge', 'BottomSheet', 'Tokens'] },
  { href: '/dev/auth', icon: '🔐', title: '인증 디버그', desc: '토큰 상태, DPoP 키쌍, 사용자 정보를 확인합니다.', items: ['AccessToken', 'DPoP KeyPair', 'AuthStore', 'Logout'] },
  { href: '/dev/member-list', icon: '👥', title: '멤버목록 (테스트)', desc: 'nextjs-new에서 복사한 멤버리스트 화면. 서버 시각 호출 + 다국어(member) 적용.', items: ['ServerCall', 'i18n', 'features/_templates'] },
  { href: '/dev/campaign-test', icon: '🧾', title: '캠페인 테스트 (주문조회)', desc: 'nextjs-new에서 복사한 캠페인 테스트 화면. 주문 목록 조회 폼 + 결과 테이블 (문자열 인라인).', items: ['주문조회', 'useMutation', 'features/_templates'] },
];

export default function DevPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">개발 도구 허브</h1>
        <p className="text-sm text-gray-500">개발 환경 전용 — 프로덕션에서는 접근이 차단됩니다.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SECTIONS.map((s) => (
          <Link key={s.href} href={s.href} className="flex flex-col gap-3 p-5 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{s.icon}</span>
              <h2 className="text-base font-bold text-gray-900">{s.title}</h2>
            </div>
            <p className="text-sm text-gray-500">{s.desc}</p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {s.items.map((item) => (
                <span key={item} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{item}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
