import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Language } from '../lib/translations';

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

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('foodshare-lang') as Language | null;
    return saved === 'ur' ? 'ur' : 'en';
  });

  const dir: 'ltr' | 'rtl' = lang === 'ur' ? 'rtl' : 'ltr';

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('foodshare-lang', newLang);
  }, []);

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
