/**
 * IA0.41 전체 구조 — IA 네비게이터 데이터
 *
 * 이 파일은 app/dev/ia/ 라우트 전용 데이터입니다.
 * 라우팅에는 영향을 주지 않습니다 (_data/ 폴더는 Next.js 라우팅에서 제외됨)
 *
 * 최종 업데이트: 2026-06 (108 분석 기준 전체 화면 반영)
 *
 * [탐색 규칙]
 * - path    : 실제 앱 경로로 이동 (링크)
 * - pattern : 동적 라우트 패턴 표시 전용 (비링크, 실제 ID 필요)
 * - children: 있으면 /dev/ia/[section]/[depth1] 서브 목록으로 이동
 */

export interface IAItem {
  id: string;
  label: string;
  path?: string;
  pattern?: string;
  children: IAItem[];
}

export const IA_DATA: IAItem[] = [
  // ─────────────────────────────────────────
  // 공통 — 비로그인 진입 및 레거시 경로
  // ─────────────────────────────────────────
  {
    id: 'common',
    label: '공통',
    children: [
      { id: 'intro',          label: '스플래시/온보딩',  path: '/intro',                children: [] },
      { id: 'simple-auth',    label: '간편인증',         path: '/auth/simple-auth',     children: [] },
      { id: 'identity',       label: '본인인증',         path: '/auth/identity',        children: [] },
      { id: 'terms-auth',     label: '약관동의',         path: '/auth/terms',           children: [] },
      { id: 'join-complete',  label: '회원가입 완료',    path: '/member/join/complete', children: [] },
    ],
  },
  // ─────────────────────────────────────────
  // 메인 홈
  // ─────────────────────────────────────────
  {
    id: 'main',
    label: '메인',
    children: [
      { id: 'home',         label: '메인 홈',    path: '/main',              children: [] },
      { id: 'notification', label: '알림',       path: '/main/notification', children: [] },
      { id: 'chatbot',      label: 'AI 챗봇',    path: '/main/chatbot',      children: [] },
      { id: 'search',       label: '통합검색',   path: '/main/search',       children: [] },
      { id: 'papago',       label: '파파고 번역', path: '/main/papago',       children: [] },  // 신규
      { id: 'translate',    label: '다국어 번역', path: '/main/translate',    children: [] },  // 신규
    ],
  },
  // ─────────────────────────────────────────
  // 적립
  // ─────────────────────────────────────────
  {
    id: 'earn',
    label: '적립',
    children: [
      { id: 'earn-main',  label: '적립 서브메인',  path: '/earn', children: [] },  // 신규
      { id: 'example-list', label: '예시 목록', path: '/earn/example', children: [] },
      {
        id: 'coupon', label: '쿠폰·플포', path: '/earn/coupon',
        children: [
          { id: 'list',   label: '목록', path: '/earn/coupon',         children: [] },
          { id: 'detail', label: '상세', pattern: '/earn/coupon/[id]', children: [] },
        ],
      },
      {
        id: 'mission', label: '미션', path: '/earn/mission',
        children: [
          { id: 'list',   label: '목록', path: '/earn/mission',         children: [] },
          { id: 'detail', label: '상세', pattern: '/earn/mission/[id]', children: [] },
        ],
      },
      {
        id: 'quiz', label: '퀴즈', path: '/earn/quiz',
        children: [
          { id: 'list',   label: '목록', path: '/earn/quiz',         children: [] },
          { id: 'detail', label: '진행', pattern: '/earn/quiz/[id]', children: [] },
        ],
      },
      {
        id: 'survey', label: '설문', path: '/earn/survey',
        children: [
          { id: 'list',   label: '목록', path: '/earn/survey',         children: [] },
          { id: 'detail', label: '진행', pattern: '/earn/survey/[id]', children: [] },
        ],
      },
      { id: 'roulette',   label: '룰렛',       path: '/earn/roulette',    children: [] },
      {
        id: 'point-work', label: '포인트워크', path: '/earn/point-work',
        children: [
          { id: 'main',      label: '대시보드',    path: '/earn/point-work',                    children: [] },
          { id: 'challenge', label: '챌린지 상세', pattern: '/earn/point-work/challenge/[id]', children: [] },
        ],
      },
      {
        id: 'highlight', label: '하이라이트', path: '/earn/highlight',
        children: [
          { id: 'list',   label: '목록', path: '/earn/highlight',         children: [] },
          { id: 'detail', label: '상세', pattern: '/earn/highlight/[id]', children: [] },
        ],
      },
      {
        id: 'event', label: '이벤트', path: '/earn/event',
        children: [
          { id: 'list',   label: '목록', path: '/earn/event',         children: [] },
          { id: 'detail', label: '상세', pattern: '/earn/event/[id]', children: [] },
        ],
      },
      { id: 'ai-chat',       label: 'AI 채팅',       path: '/earn/ai-chat',       children: [] },
      { id: 'fortune',       label: '데일리 운세',   path: '/earn/fortune',       children: [] },
      { id: 'game',          label: '게임',           path: '/earn/game',          children: [] },
      { id: 'random-box',    label: '랜덤박스',       path: '/earn/random-box',    children: [] },
      { id: 'stamp',         label: '스탬프',         path: '/earn/stamp',         children: [] },
      { id: 'quokka-farm',   label: '쿼카팜',         path: '/earn/quokka-farm',   children: [] },  // 신규
      { id: 'point-collect', label: '포인트 모으기',  path: '/earn/point-collect', children: [] },  // 신규
    ],
  },
  // ─────────────────────────────────────────
  // 사용
  // ─────────────────────────────────────────
  {
    id: 'use',
    label: '사용',
    children: [
      { id: 'use-main', label: '사용 서브메인', path: '/use', children: [] },  // 신규
      {
        id: 'product', label: '상품', path: '/use/product',
        children: [
          { id: 'list',   label: '목록', path: '/use/product',         children: [] },
          { id: 'detail', label: '상세', pattern: '/use/product/[id]', children: [] },
        ],
      },
      { id: 'gift',          label: '선물하기',    path: '/use/gift',          children: [] },
      { id: 'affiliate-map', label: '제휴처 안내', path: '/use/affiliate-map', children: [] },
      {
        id: 'donation', label: '기부', path: '/use/donation',
        children: [
          { id: 'list',   label: '목록', path: '/use/donation',         children: [] },
          { id: 'detail', label: '상세', pattern: '/use/donation/[id]', children: [] },
        ],
      },
      { id: 'subscription', label: '구독쿠폰딜', path: '/use/subscription', children: [] },
      {
        id: 'culture', label: '컬처', path: '/use/culture',
        children: [
          { id: 'list',   label: '목록', path: '/use/culture',         children: [] },
          { id: 'detail', label: '상세', pattern: '/use/culture/[id]', children: [] },
        ],
      },
      { id: 'tax-refund',  label: '텍스리펀드', path: '/use/tax-refund', children: [] },
      {
        id: 'live', label: '쇼핑Live', path: '/use/live',
        children: [
          { id: 'list',   label: '목록', path: '/use/live',         children: [] },
          { id: 'detail', label: '상세', pattern: '/use/live/[id]', children: [] },
        ],
      },
      { id: 'point-shop', label: '포인트샵', path: '/use/point-shop', children: [] },
    ],
  },
  // ─────────────────────────────────────────
  // 결제
  // ─────────────────────────────────────────
  {
    id: 'pay',
    label: '결제',
    children: [
      { id: 'pay-main',      label: '결제 서브메인',    path: '/pay',               children: [] },
      { id: 'brand-payment', label: '브랜드결제',       path: '/pay/brand-payment', children: [] },
      {
        id: 'charge', label: '포인트 충전', path: '/pay/charge',
        children: [
          { id: 'charge-main',      label: '충전 서브메인',  path: '/pay/charge',           children: [] },
          { id: 'charge-history',   label: '충전 내역 조회', path: '/pay/charge/history',   children: [] },  // 신규
          { id: 'charge-auto',      label: '자동충전',       path: '/pay/charge/auto',      children: [] },  // 신규
          { id: 'charge-scheduled', label: '예약충전',       path: '/pay/charge/scheduled', children: [] },  // 신규
        ],
      },
      {
        id: 'transfer', label: '포인트 전환', path: '/pay/transfer',
        children: [
          { id: 'transfer-main',    label: '전환 서브메인',  path: '/pay/transfer',         children: [] },
          { id: 'transfer-history', label: '전환 내역 조회', path: '/pay/transfer/history', children: [] },  // 신규
        ],
      },
      { id: 'receipt',     label: '전자영수증',      path: '/pay/receipt',     children: [] },
      { id: 'direct-earn', label: '사후 적립',       path: '/pay/direct-earn', children: [] },
      { id: 'card',        label: '카드/Pay 관리',   path: '/pay/card',        children: [] },
      { id: 'history',     label: '결제 내역',       path: '/pay/history',     children: [] },
      { id: 'affiliate',   label: '결제 제휴처 안내', path: '/pay/affiliate',  children: [] },  // 신규
    ],
  },
  // ─────────────────────────────────────────
  // MY
  // ─────────────────────────────────────────
  {
    id: 'my',
    label: 'MY',
    children: [
      { id: 'my-main',        label: '마이페이지 메인', path: '/my',                children: [] },
      { id: 'history',        label: '이용/구매 내역',  path: '/my/history',        children: [] },
      { id: 'activity',       label: '활동/참여 내역',  path: '/my/activity',       children: [] },
      { id: 'point',          label: '포인트 현황',     path: '/my/point',          children: [] },
      { id: 'badge',          label: '배지함',          path: '/my/badge',          children: [] },
      { id: 'coupon',         label: 'MY 쿠폰',         path: '/my/coupon',         children: [] },
      { id: 'wishlist',       label: '찜 목록',         path: '/my/wishlist',       children: [] },
      { id: 'interest-point', label: '관심지점',        path: '/my/interest-point', children: [] },
      { id: 'login-history',  label: '로그인 이력',     path: '/my/login-history',  children: [] },
      { id: 'purchase',       label: '구매 내역',       path: '/my/purchase',       children: [] },
      { id: 'card',           label: '보유카드',        path: '/my/card',           children: [] },
      { id: 'comment',        label: '댓글',            path: '/my/comment',        children: [] },
      { id: 'asset',          label: '포인트/자산',     path: '/my/asset',          children: [] },
      { id: 'qr',             label: 'QR·바코드',       path: '/my/qr',             children: [] },
      { id: 'donation',       label: '기부 내역',       path: '/my/donation',       children: [] },
      { id: 'event',          label: '이벤트 내역',     path: '/my/event',          children: [] },
      { id: 'gift',           label: '선물 내역',       path: '/my/gift',           children: [] },
      { id: 'receipt',        label: '영수증 내역',     path: '/my/receipt',        children: [] },
      { id: 'subscription',   label: '구독 내역',       path: '/my/subscription',   children: [] },
    ],
  },
  // ─────────────────────────────────────────
  // 회원
  // ─────────────────────────────────────────
  {
    id: 'member',
    label: '회원',
    children: [
      { id: 'login',           label: '통합 로그인 게이트', path: '/member/login',           children: [] },  // 신규
      { id: 'find-id',         label: '아이디 찾기',        path: '/member/find-id',         children: [] },  // 신규
      { id: 'find-password',   label: '비밀번호 찾기',      path: '/member/find-password',   children: [] },  // 신규
      { id: 'restricted',      label: '이용제한/탈퇴 안내', path: '/member/restricted',      children: [] },  // 신규
      { id: 'linked-services', label: '연동서비스관리',     path: '/member/linked-services', children: [] },  // 신규
      { id: 'affiliate',       label: '계열사 연결',        path: '/member/affiliate',       children: [] },
      {
        id: 'club', label: '클럽', path: '/member/club',
        children: [
          { id: 'club-main',         label: '클럽 서브메인',    path: '/member/club',              children: [] },
          { id: 'club-notification', label: '클럽 알림',        path: '/member/club/notification', children: [] },  // 신규
          { id: 'club-detail',       label: '클럽 상세',        pattern: '/member/club/[id]',                       children: [] },  // 신규
          { id: 'club-content',      label: '클럽 콘텐츠 상세', pattern: '/member/club/[id]/content/[contentId]',  children: [] },  // 신규
          { id: 'club-join',         label: '클럽 가입',        path: '/member/club/join',                          children: [] },  // 신규
        ],
      },
      {
        id: 'join', label: '회원 가입', path: '/member/join',
        children: [
          { id: 'form',     label: '가입 폼',   path: '/member/join',          children: [] },
          { id: 'complete', label: '가입 완료', path: '/member/join/complete', children: [] },
        ],
      },
      { id: 'profile', label: '프로필', path: '/member/profile', children: [] },
    ],
  },
  // ─────────────────────────────────────────
  // 설정
  // ─────────────────────────────────────────
  {
    id: 'settings',
    label: '설정',
    children: [
      { id: 'settings-main', label: '설정 메인',        path: '/settings',               children: [] },
      { id: 'profile',       label: '개인정보변경',     path: '/settings/profile',       children: [] },
      { id: 'security',      label: '생체인증/비밀번호', path: '/settings/security',     children: [] },
      { id: 'notification',  label: '알림 설정',        path: '/settings/notification',  children: [] },
      { id: 'account',       label: '계정 연동/탈퇴',   path: '/settings/account',       children: [] },
      { id: 'otp',           label: 'OTP 인증 발급',    path: '/settings/otp',           children: [] },  // 신규
      { id: 'cash-receipt',  label: '현금영수증 발급',  path: '/settings/cash-receipt',  children: [] },  // 신규
      { id: 'withdraw',      label: '회원 탈퇴',        path: '/settings/withdraw',      children: [] },  // 신규
    ],
  },
  // ─────────────────────────────────────────
  // 하단 (Footer)
  // ─────────────────────────────────────────
  {
    id: 'footer',
    label: '하단',
    children: [
      { id: 'guide',       label: '이용안내',     path: '/footer/guide',       children: [] },
      {
        id: 'cs', label: '고객센터', path: '/footer/cs',
        children: [
          { id: 'cs-main',       label: '1:1문의',      path: '/footer/cs',            children: [] },
          { id: 'cs-my-inquiry', label: 'MY문의내역',   path: '/footer/cs/my-inquiry', children: [] },  // 신규
          { id: 'cs-faq',        label: '자주묻는질문', path: '/footer/cs/faq',        children: [] },  // 신규
        ],
      },
      {
        id: 'notice', label: '공지사항', path: '/footer/notice',
        children: [
          { id: 'notice-list',   label: '공지사항 목록', path: '/footer/notice',         children: [] },
          { id: 'notice-detail', label: '공지사항 상세', pattern: '/footer/notice/[id]', children: [] },  // 신규
        ],
      },
      { id: 'terms',       label: '약관 및 정책', path: '/footer/terms',       children: [] },
      { id: 'app-version', label: '앱 버전 정보', path: '/footer/app-version', children: [] },
    ],
  },
];
