export interface Notice { id: string; title: string; content?: string; date: string; isImportant?: boolean; }
export interface FaqItem { id: string; question: string; answer: string; category?: string; }
export interface Inquiry { title: string; content: string; contactEmail?: string; }
export const FooterErrorCode = { INQUIRY_FAIL: 'INQUIRY_FAIL' } as const;
