import type { Language } from './translations';

const MONTHS: Record<Language, string[]> = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  ur: ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'],
};

// Formats YYYY-MM-DD without Intl, so pre-rendered and hydrated output always match.
export function formatDate(isoDate: string, lang: Language): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  return `${d} ${MONTHS[lang][m - 1]} ${y}`;
}
