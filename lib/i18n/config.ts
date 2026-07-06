// 지원 언어·기본 언어 설정
// 정적 문자팩(messages/*.json): ko·en·zh
// 동적 번역(Azure, /api/messages): ja·th·vi·ms
export const supportedLocales = ['ko', 'en', 'zh', 'ja', 'th', 'vi', 'ms'] as const;
export type Locale = typeof supportedLocales[number];
export const defaultLocale: Locale = 'ko';
