import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../lib/translations';
import { localizedPath } from '../lib/seo';
import { faqItems, publicChrome, blogIntro } from '../content/publicContent';
import { postsFor } from '../content/blog';
import BlogPostCard from '../components/BlogPostCard';
import PublicLayout, { JoinCta } from '../components/PublicLayout';
import { Heart, MapPin, Shield, HandCoins, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const { lang } = useLanguage();
  const chrome = publicChrome[lang];

  const features = [
    { icon: HandCoins, color: 'bg-primary-100 text-primary-600', title: t('landingFree', lang), desc: t('landingFreeDesc', lang) },
    { icon: MapPin, color: 'bg-warmOrange-100 text-warmOrange-600', title: t('landingLiveMap', lang), desc: t('landingLiveMapDesc', lang) },
    { icon: Heart, color: 'bg-pink-100 text-pink-600', title: t('landingShareDignity', lang), desc: t('landingShareDignityDesc', lang) },
    { icon: Shield, color: 'bg-blue-100 text-blue-600', title: t('landingSafeVerified', lang), desc: t('landingSafeVerifiedDesc', lang) },
  ];

  const steps = [
    { step: '1', icon: '🥗', title: t('landingDonorPosts', lang), desc: t('landingDonorPostsDesc', lang) },
    { step: '2', icon: '📍', title: t('landingReceiverFinds', lang), desc: t('landingReceiverFindsDesc', lang) },
    { step: '3', icon: '🔔', title: t('landingClaimNotify', lang), desc: t('landingClaimNotifyDesc', lang) },
    { step: '4', icon: '🎉', title: t('landingPickup', lang), desc: t('landingPickupDesc', lang) },
  ];

  const shareables = [
    { icon: '🍝', label: t('landingShareMeals', lang) },
    { icon: '🍛', label: t('landingShareRice', lang) },
    { icon: '🍞', label: t('landingShareBread', lang) },
    { icon: '🍎', label: t('landingShareFruit', lang) },
    { icon: '🥫', label: t('landingSharePackaged', lang) },
  ];

  return (
    <PublicLayout>
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero */}
        <section className="text-center max-w-3xl mx-auto pt-16 md:pt-24">
          <p className="text-primary-700 font-semibold mb-4">{chrome.tagline}</p>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            {t('landingHeroTitle', lang)}
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">{t('landingConnect', lang)}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register?role=donor" className="btn-primary text-lg px-8 py-4">
              {chrome.ctaShare}
            </Link>
            <Link to="/register?role=receiver" className="btn-orange text-lg px-8 py-4 flex items-center justify-center gap-2">
              {chrome.ctaFind} <ArrowRight className="w-5 h-5 rtl:rotate-180" />
            </Link>
          </div>
          <Link to={localizedPath('howItWorks', lang)} className="inline-block mt-6 text-primary-700 font-medium hover:underline">
            {t('landingLearnHow', lang)}
          </Link>
        </section>

        {/* Features */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-24">
          {features.map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="card text-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${color}`}>
                <Icon className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-bold mb-2">{title}</h2>
              <p className="text-gray-600 text-sm">{desc}</p>
            </div>
          ))}
        </section>

        {/* How it works */}
        <section className="mt-24 text-center">
          <h2 className="text-3xl font-bold mb-12">{t('landingHowItWorks', lang)}</h2>
          <ol className="grid md:grid-cols-4 gap-6">
            {steps.map((item) => (
              <li key={item.step}>
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">
                  {item.step}
                </div>
                <div className="text-3xl mb-2" aria-hidden="true">{item.icon}</div>
                <h3 className="font-bold">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </li>
            ))}
          </ol>
          <Link to={localizedPath('howItWorks', lang)} className="inline-block mt-10 text-primary-700 font-medium hover:underline">
            {t('landingFullGuide', lang)}
          </Link>
        </section>

        {/* What can you share */}
        <section className="mt-24 text-center">
          <h2 className="text-3xl font-bold mb-3">{t('landingWhatToShare', lang)}</h2>
          <p className="text-gray-600 mb-8">{t('landingWhatToShareDesc', lang)}</p>
          <ul className="flex flex-wrap justify-center gap-3">
            {shareables.map((item) => (
              <li key={item.label} className="card py-3 px-5 flex items-center gap-2 font-medium text-gray-800">
                <span aria-hidden="true">{item.icon}</span> {item.label}
              </li>
            ))}
          </ul>
          <Link to={localizedPath('foodSafety', lang)} className="inline-block mt-8 text-primary-700 font-medium hover:underline">
            {t('landingSafetyTips', lang)}
          </Link>
        </section>

        {/* FAQ teaser */}
        <section className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">{t('landingQuestions', lang)}</h2>
          <div className="space-y-4">
            {faqItems[lang].slice(0, 3).map((item) => (
              <div key={item.q} className="card">
                <h3 className="font-bold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link to={localizedPath('faq', lang)} className="inline-block mt-8 text-primary-700 font-medium hover:underline">
              {t('landingAllQuestions', lang)}
            </Link>
          </div>
        </section>

        {/* Latest posts */}
        <section className="mt-24">
          <h2 className="text-3xl font-bold mb-8 text-center">{blogIntro[lang].latest}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {postsFor(lang).slice(0, 3).map((post) => (
              <BlogPostCard key={post.slug} post={post} lang={lang} />
            ))}
          </div>
          <div className="text-center">
            <Link to={localizedPath('blog', lang)} className="inline-block mt-8 text-primary-700 font-medium hover:underline">
              {blogIntro[lang].allPosts}
            </Link>
          </div>
        </section>
      </div>

      <JoinCta />
    </PublicLayout>
  );
}
