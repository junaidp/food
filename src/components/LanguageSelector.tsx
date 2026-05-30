import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';
import { t } from '../lib/translations';

export default function LanguageSelector() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        aria-label={t('language', lang)}
      >
        <Globe className="w-4 h-4" />
        <span className="uppercase">{lang === 'en' ? 'EN' : 'UR'}</span>
      </button>
      <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-white border border-gray-100 rounded-xl shadow-lg py-1 min-w-[140px] z-50">
        <button
          onClick={() => setLang('en')}
          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${lang === 'en' ? 'font-semibold text-primary-600' : 'text-gray-700'}`}
        >
          {t('english', lang)}
        </button>
        <button
          onClick={() => setLang('ur')}
          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${lang === 'ur' ? 'font-semibold text-primary-600' : 'text-gray-700'}`}
        >
          {t('urdu', lang)}
        </button>
      </div>
    </div>
  );
}
