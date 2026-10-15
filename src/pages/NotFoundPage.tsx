import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { publicChrome } from '../content/publicContent';
import { localizedPath } from '../lib/seo';
import PublicLayout from '../components/PublicLayout';

export default function NotFoundPage() {
  const { lang } = useLanguage();
  const chrome = publicChrome[lang];

  return (
    <PublicLayout>
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-6" aria-hidden="true">🍽️</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{chrome.notFoundTitle}</h1>
        <p className="text-gray-600 mb-8">{chrome.notFoundText}</p>
        <Link to={localizedPath('home', lang)} className="btn-primary">{chrome.notFoundHome}</Link>
      </div>
    </PublicLayout>
  );
}
