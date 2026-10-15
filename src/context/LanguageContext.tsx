import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Language } from '../lib/translations';
import { matchPublicRoute, alternatePath } from '../lib/seo';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  dir: 'ltr',
});

function readStoredLang(): Language {
  try {
    return localStorage.getItem('foodshare-lang') === 'ur' ? 'ur' : 'en';
  } catch {
    return 'en';
  }
}

function storeLang(lang: Language) {
  try {
    localStorage.setItem('foodshare-lang', lang);
  } catch {
    // storage unavailable (private mode, pre-render)
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [storedLang, setStoredLang] = useState<Language>(() =>
    typeof window === 'undefined' ? 'en' : readStoredLang()
  );

  // Public pages have one URL per language (/faq, /ur/faq), so the URL decides there.
  const urlLang = matchPublicRoute(pathname)?.lang ?? null;
  const lang = urlLang ?? storedLang;
  const dir: 'ltr' | 'rtl' = lang === 'ur' ? 'rtl' : 'ltr';

  // Visitors arriving on an Urdu page keep Urdu when they continue into the app.
  // English URLs don't reset the preference, so Urdu users opening "/" stay in Urdu.
  useEffect(() => {
    if (urlLang === 'ur') {
      setStoredLang('ur');
      storeLang('ur');
    }
  }, [urlLang]);

  const setLang = useCallback(
    (newLang: Language) => {
      setStoredLang(newLang);
      storeLang(newLang);
      const alt = alternatePath(pathname, newLang);
      if (alt && alt !== pathname) navigate(alt);
    },
    [pathname, navigate]
  );

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
