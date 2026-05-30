import { t } from './translations';
import type { Language } from './translations';

export function formatDistance(lat1: number, lon1: number, lat2: number, lon2: number): string {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  if (d < 1) {
    return `${Math.round(d * 1000)} m`;
  }
  return `${d.toFixed(1)} km`;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function formatTimeAgo(dateStr: string, lang: Language = 'en'): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (mins < 1) return t('justNow', lang);
  if (mins < 60) return t('minAgo', lang, { m: mins });
  if (hours < 24) return t('hourAgo', lang, { h: hours });
  return t('dayAgo', lang, { d: days });
}

export function formatExpiry(dateStr: string, lang: Language = 'en'): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = date.getTime() - now.getTime();

  if (diff <= 0) return t('expired', lang);

  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);

  if (mins < 60) return t('minsLeft', lang, { m: mins });
  if (hours < 24) return t('hoursMinsLeft', lang, { h: hours, m: mins % 60 });
  return t('daysHoursLeft', lang, { d: Math.floor(hours / 24), h: hours % 24 });
}

export function getPickupTimeRemaining(expiresAt: string, lang: Language = 'en'): string {
  const expires = new Date(expiresAt);
  const now = new Date();
  const diff = expires.getTime() - now.getTime();

  if (diff <= 0) return t('timeExpired', lang);

  const mins = Math.floor(diff / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
