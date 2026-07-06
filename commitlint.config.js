// commitlint 설정
// 패키지 설치 필요: npm install --save-dev @commitlint/config-conventional @commitlint/cli husky lint-staged
// husky 초기화: npx husky init
// .husky/commit-msg 파일에 추가: npx --no -- commitlint --edit $1

/** @type {import('@commitlint/types').UserConfig} */
const config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // type 허용 목록
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 새로운 기능
        'fix',      // 버그 수정
        'docs',     // 문서 수정
        'style',    // 코드 포맷 변경 (기능 변경 없음)
        'refactor', // 리팩토링
        'test',     // 테스트 추가/수정
        'chore',    // 빌드 설정, 패키지 관리 등
        'perf',     // 성능 개선
        'ci',       // CI/CD 설정 변경
        'revert',   // 커밋 되돌리기
      ],
    ],
    // subject 최대 길이
    'subject-max-length': [2, 'always', 100],
    // subject 빈 줄 불가
    'subject-empty': [2, 'never'],
    // type 소문자 강제
    'type-case': [2, 'always', 'lower-case'],
  },
};

module.exports = config;
