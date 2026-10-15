import type { Language } from './translations';
import { t } from './translations';
import { pageText, faqItems, type PublicPage } from '../content/publicContent';

// Set VITE_SITE_URL to the production origin (no trailing slash) before building.
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://foodshare.example.com').replace(/\/+$/, '');
export const SITE_NAME = 'FoodShare';
export const OG_IMAGE = { path: '/og-image.png', width: 1200, height: 630 };

export const LANGUAGES: Language[] = ['en', 'ur'];

const PAGE_PATHS: Record<PublicPage, string> = {
  home: '/',
  howItWorks: '/how-it-works',
  faq: '/faq',
  about: '/about',
  foodSafety: '/food-safety',
};

export const PUBLIC_PAGES = Object.keys(PAGE_PATHS) as PublicPage[];

export function localizedPath(page: PublicPage, lang: Language): string {
  const base = PAGE_PATHS[page];
  if (lang === 'en') return base;
  return base === '/' ? `/${lang}` : `/${lang}${base}`;
}

export interface PublicRoute {
  path: string;
  page: PublicPage;
  lang: Language;
}

export const PUBLIC_ROUTES: PublicRoute[] = LANGUAGES.flatMap((lang) =>
  PUBLIC_PAGES.map((page) => ({ path: localizedPath(page, lang), page, lang }))
);

export function matchPublicRoute(pathname: string): PublicRoute | null {
  return PUBLIC_ROUTES.find((r) => r.path === pathname) ?? null;
}

// The same public page in another language, or null when the path isn't a public page.
export function alternatePath(pathname: string, lang: Language): string | null {
  const route = matchPublicRoute(pathname);
  return route ? localizedPath(route.page, lang) : null;
}

const OG_LOCALE: Record<Language, string> = { en: 'en_US', ur: 'ur_PK' };

type HeadTag = { tag: 'meta' | 'link' | 'script'; attrs: Record<string, string>; content?: string };

export interface PageMeta {
  title: string;
  lang: Language;
  tags: HeadTag[];
}

const absolute = (path: string) => `${SITE_URL}${path === '/' ? '/' : path}`;

function structuredData(route: PublicRoute) {
  const { page, lang } = route;
  const url = absolute(route.path);
  const orgId = `${SITE_URL}/#organization`;
  const graph: object[] = [];

  if (page === 'home') {
    graph.push(
      {
        '@type': 'Organization',
        '@id': orgId,
        name: SITE_NAME,
        url: absolute('/'),
        logo: absolute('/pwa-512x512.png'),
        description: pageText.about.en.description,
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: absolute('/'),
        inLanguage: LANGUAGES,
        publisher: { '@id': orgId },
      },
      {
        '@type': 'WebApplication',
        name: SITE_NAME,
        url: absolute('/'),
        applicationCategory: 'LifestyleApplication',
        operatingSystem: 'Any',
        browserRequirements: 'Requires JavaScript',
        description: pageText.home[lang].description,
        inLanguage: lang,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        publisher: { '@id': orgId },
      }
    );
  } else {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: pageText.home[lang].navLabel, item: absolute(localizedPath('home', lang)) },
        { '@type': 'ListItem', position: 2, name: pageText[page][lang].navLabel, item: url },
      ],
    });
  }

  if (page === 'faq') {
    graph.push({
      '@type': 'FAQPage',
      inLanguage: lang,
      mainEntity: faqItems[lang].map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

function privateTitle(pathname: string, lang: Language): string {
  if (pathname === '/login') return `${t('landingLogin', lang)} | ${SITE_NAME}`;
  if (pathname === '/register') return `${t('landingSignUp', lang)} | ${SITE_NAME}`;
  return SITE_NAME;
}

export function getPageMeta(pathname: string, uiLang: Language): PageMeta {
  const route = matchPublicRoute(pathname);

  // App screens (login, dashboards, 404s) stay out of the index.
  if (!route) {
    return {
      title: privateTitle(pathname, uiLang),
      lang: uiLang,
      tags: [
        { tag: 'meta', attrs: { name: 'description', content: pageText.home[uiLang].description } },
        { tag: 'meta', attrs: { name: 'robots', content: 'noindex' } },
      ],
    };
  }

  const { page, lang } = route;
  const { title, description } = pageText[page][lang];
  const url = absolute(route.path);
  const image = absolute(OG_IMAGE.path);

  const tags: HeadTag[] = [
    { tag: 'meta', attrs: { name: 'description', content: description } },
    { tag: 'meta', attrs: { name: 'robots', content: 'index, follow, max-image-preview:large' } },
    { tag: 'link', attrs: { rel: 'canonical', href: url } },
    ...LANGUAGES.map((l): HeadTag => ({
      tag: 'link',
      attrs: { rel: 'alternate', hreflang: l, href: absolute(localizedPath(page, l)) },
    })),
    { tag: 'link', attrs: { rel: 'alternate', hreflang: 'x-default', href: absolute(localizedPath(page, 'en')) } },
    { tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
    { tag: 'meta', attrs: { property: 'og:site_name', content: SITE_NAME } },
    { tag: 'meta', attrs: { property: 'og:title', content: title } },
    { tag: 'meta', attrs: { property: 'og:description', content: description } },
    { tag: 'meta', attrs: { property: 'og:url', content: url } },
    { tag: 'meta', attrs: { property: 'og:locale', content: OG_LOCALE[lang] } },
    ...LANGUAGES.filter((l) => l !== lang).map((l): HeadTag => ({
      tag: 'meta',
      attrs: { property: 'og:locale:alternate', content: OG_LOCALE[l] },
    })),
    { tag: 'meta', attrs: { property: 'og:image', content: image } },
    { tag: 'meta', attrs: { property: 'og:image:width', content: String(OG_IMAGE.width) } },
    { tag: 'meta', attrs: { property: 'og:image:height', content: String(OG_IMAGE.height) } },
    { tag: 'meta', attrs: { property: 'og:image:alt', content: pageText.home[lang].title } },
    { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
    { tag: 'meta', attrs: { name: 'twitter:title', content: title } },
    { tag: 'meta', attrs: { name: 'twitter:description', content: description } },
    { tag: 'meta', attrs: { name: 'twitter:image', content: image } },
    {
      tag: 'script',
      attrs: { type: 'application/ld+json' },
      content: JSON.stringify(structuredData(route)).replace(/</g, '\\u003c'),
    },
  ];

  return { title, lang, tags };
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Server side: head markup for pre-rendered pages. Tags carry data-seo so the client can swap them.
export function renderHeadTags(meta: PageMeta): string {
  const lines = [`<title>${escapeHtml(meta.title)}</title>`];
  for (const { tag, attrs, content } of meta.tags) {
    const attrStr = Object.entries(attrs)
      .map(([k, v]) => ` ${k}="${escapeHtml(v)}"`)
      .join('');
    lines.push(tag === 'script' ? `<script data-seo${attrStr}>${content}</script>` : `<${tag} data-seo${attrStr} />`);
  }
  return lines.join('\n    ');
}

// Client side: replace the managed head tags after each navigation.
export function applyPageMeta(meta: PageMeta) {
  document.title = meta.title;
  document.head.querySelectorAll('[data-seo]').forEach((el) => el.remove());
  for (const { tag, attrs, content } of meta.tags) {
    const el = document.createElement(tag);
    el.setAttribute('data-seo', '');
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    if (content) el.textContent = content;
    document.head.appendChild(el);
  }
}

export function buildSitemap(lastmod: string): string {
  const urls = PUBLIC_ROUTES.map((route) => {
    const alternates = LANGUAGES.map(
      (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${absolute(localizedPath(route.page, l))}" />`
    ).join('\n');
    return [
      '  <url>',
      `    <loc>${absolute(route.path)}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      alternates,
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${absolute(localizedPath(route.page, 'en'))}" />`,
      '  </url>',
    ].join('\n');
  });
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');
}

export function buildRobots(): string {
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    'Disallow: /donor',
    'Disallow: /receiver',
    'Disallow: /admin',
    'Disallow: /notifications',
    'Disallow: /profile',
    'Disallow: /verify-otp',
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n');
}
