/**
 * lib/i18n/helpers.ts
 *
 * Intl API 기반 locale 포매터 유틸.
 */

export function formatCurrency(
  amount:   number,
  locale:   string,
  currency = 'KRW',
): string {
  return new Intl.NumberFormat(locale, {
    style:    'currency',
    currency,
    maximumFractionDigits: currency === 'KRW' ? 0 : 2,
  }).format(amount);
}

export function formatDate(
  date:    Date | string | number,
  locale:  string,
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' },
): string {
  return new Intl.DateTimeFormat(locale, options).format(new Date(date));
}

export function formatNumber(
  value:   number,
  locale:  string,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}
