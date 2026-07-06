/**
 * 브랜드·시맨틱 색상 토큰
 * CSS 변수(colors.css)와 동일한 값 — JS에서 참조할 때(dev/ui/tokens 등) 사용.
 */
export const colors = {
  primary:   { 50: '#EFF6FF', 100: '#DBEAFE', 500: '#3B82F6', 600: '#2563EB', 700: '#1D4ED8' },
  secondary: { 500: '#6B7280', 600: '#4B5563' },
  success:   { 500: '#10B981', 600: '#059669', light: '#D1FAE5', text: '#065F46' },
  warning:   { 500: '#F59E0B', 600: '#D97706', light: '#FEF3C7', text: '#B45309' },
  error:     { 500: '#EF4444', 600: '#DC2626', light: '#FEE2E2', text: '#B91C1C' },
  info:      { 500: '#3B82F6', light: '#DBEAFE', text: '#1D4ED8' },
  white:     '#FFFFFF',
  black:     '#000000',
} as const;

export type ColorKey = keyof typeof colors;
