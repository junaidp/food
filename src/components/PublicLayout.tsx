import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../lib/translations';
import { localizedPath, matchPublicRoute } from '../lib/seo';
import { pageText, publicChrome, type PublicPage } from '../content/publicContent';
import LanguageSelector from './LanguageSelector';
import { ArrowRight } from 'lucide-react';

const NAV_PAGES: PublicPage[] = ['howItWorks', 'faq', 'foodSafety', 'about'];

export function JoinCta() {
  const { lang } = useLanguage();
  const chrome = publicChrome[lang];

  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      <div className="card text-center bg-gradient-to-br from-primary-600 to-primary-700 border-0 text-white p-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">{chrome.ctaTitle}</h2>
        <p className="text-primary-50 mb-8">{chrome.ctaText}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/register?role=donor" className="bg-white text-primary-700 px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-colors">
            {chrome.ctaShare}
          </Link>
          <Link to="/register?role=receiver" className="bg-warmOrange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-warmOrange-600 transition-colors flex items-center justify-center gap-2">
            {chrome.ctaFind} <ArrowRight className="w-5 h-5 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const { lang } = useLanguage();
  const { pathname } = useLocation();
  const chrome = publicChrome[lang];
  const route = matchPublicRoute(pathname);
  const otherLang = lang === 'en' ? 'ur' : 'en';
  const otherLangHref = localizedPath(route?.page ?? 'home', otherLang);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 via-white to-warmOrange-50">
      <header className="max-w-6xl w-full mx-auto px-4 pt-6">
        <nav className="flex items-center justify-between gap-4">
          <Link to={localizedPath('home', lang)} className="flex items-center gap-2 shrink-0">
            <span className="text-3xl" aria-hidden="true">🍽️</span>
            <span className="text-2xl font-bold text-gray-900">{t('appName', lang)}</span>
          </Link>
          <ul className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-600">
            {NAV_PAGES.map((page) => (
              <li key={page}>
                <Link to={localizedPath(page, lang)} className="hover:text-primary-700 transition-colors">
                  {pageText[page][lang].navLabel}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSelector />
            <Link to="/login" className="btn-secondary text-sm py-2 px-4">{t('landingLogin', lang)}</Link>
            <Link to="/register" className="btn-primary text-sm py-2 px-4 hidden sm:inline-block">{t('landingSignUp', lang)}</Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-gray-100 bg-white/60">
        <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3 text-sm">
          <div>
            <p className="flex items-center gap-2 font-bold text-gray-900 text-base mb-2">
              <span aria-hidden="true">🍽️</span> {t('appName', lang)}
            </p>
            <p className="text-gray-500">{chrome.footerAbout}</p>
          </div>
          <ul className="space-y-2">
            {(['home', ...NAV_PAGES] as PublicPage[]).map((page) => (
              <li key={page}>
                <Link to={localizedPath(page, lang)} className="text-gray-600 hover:text-primary-700">
                  {pageText[page][lang].navLabel}
                </Link>
              </li>
            ))}
          </ul>
          <div className="space-y-2">
            <Link to={otherLangHref} hrefLang={otherLang} lang={otherLang} className="text-gray-600 hover:text-primary-700 block">
              {chrome.languageLinkLabel}
            </Link>
            <p className="text-gray-400">© {new Date().getFullYear()} {t('appName', lang)} — {chrome.tagline}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
