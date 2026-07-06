import Link from 'next/link';

/**
 * 퍼블리셔 화면 목록
 * pub/ 폴더에 새 화면이 추가될 때 여기에도 추가하세요
 */
const PUB_SCREENS = [
  {
    domain: '적립 (earn)',
    screens: [
      { label: '쿠폰 목록', href: '/dev/pub/earn/coupon-list' },
    ],
  },
  // 도메인 추가 예시:
  // { domain: '사용 (use)', screens: [ ... ] },
];

export default function PubIndexPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">퍼블리셔 화면 미리보기</h1>
        <p className="text-sm text-gray-500 mt-1">
          <code className="bg-gray-100 px-1 rounded">pub/</code> 폴더의 화면을 목업 데이터로 확인합니다.
        </p>
      </div>
      {PUB_SCREENS.map((group) => (
        <div key={group.domain}>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{group.domain}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {group.screens.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <p className="font-medium text-gray-800">{s.label}</p>
                <p className="text-xs text-gray-400 mt-1 truncate">{s.href}</p>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
