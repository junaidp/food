import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../lib/translations';
import LanguageSelector from '../components/LanguageSelector';
import { Heart, MapPin, Shield, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-warmOrange-50">
      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-20">
        <nav className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🍽️</span>
            <span className="text-2xl font-bold text-gray-900">{t('appName', lang)}</span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSelector />
            <Link to="/login" className="btn-secondary text-sm py-2 px-4">{t('landingLogin', lang)}</Link>
            <Link to="/register" className="btn-primary text-sm py-2 px-4">{t('landingSignUp', lang)}</Link>
          </div>
        </nav>

        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
            {t('landingShareFood', lang)}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-warmOrange-500">
              {t('landingShareLove', lang)}
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-xl mx-auto">
            {t('landingConnect', lang)}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2">
              {t('landingGetStarted', lang)} <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="card text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-bold mb-2">{t('landingShareDignity', lang)}</h3>
            <p className="text-gray-600 text-sm">{t('landingShareDignityDesc', lang)}</p>
          </div>
          <div className="card text-center">
            <div className="w-16 h-16 bg-warmOrange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-warmOrange-600" />
            </div>
            <h3 className="text-lg font-bold mb-2">{t('landingLiveMap', lang)}</h3>
            <p className="text-gray-600 text-sm">{t('landingLiveMapDesc', lang)}</p>
          </div>
          <div className="card text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold mb-2">{t('landingSafeVerified', lang)}</h3>
            <p className="text-gray-600 text-sm">{t('landingSafeVerifiedDesc', lang)}</p>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold mb-12">{t('landingHowItWorks', lang)}</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', icon: '🥗', title: t('landingDonorPosts', lang), desc: t('landingDonorPostsDesc', lang) },
              { step: '2', icon: '📍', title: t('landingReceiverFinds', lang), desc: t('landingReceiverFindsDesc', lang) },
              { step: '3', icon: '🔔', title: t('landingClaimNotify', lang), desc: t('landingClaimNotifyDesc', lang) },
              { step: '4', icon: '🎉', title: t('landingPickup', lang), desc: t('landingPickupDesc', lang) },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">
                  {item.step}
                </div>
                <div className="text-3xl mb-2">{item.icon}</div>
                <h3 className="font-bold">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <footer className="mt-24 text-center text-gray-400 text-sm border-t border-gray-100 pt-8">
          <p>{t('appName', lang)} — </p>
          <p className="mt-1"></p>
        </footer>
      </div>
    </div>
  );
}
