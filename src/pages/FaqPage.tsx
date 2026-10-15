import { useLanguage } from '../context/LanguageContext';
import { faqIntro, faqItems } from '../content/publicContent';
import PublicLayout, { JoinCta } from '../components/PublicLayout';

export default function FaqPage() {
  const { lang } = useLanguage();
  const intro = faqIntro[lang];

  return (
    <PublicLayout>
      <article className="max-w-3xl mx-auto px-4 pt-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">{intro.h1}</h1>
        <p className="text-lg text-gray-600 mb-10">{intro.intro}</p>
        <div className="space-y-4">
          {faqItems[lang].map((item) => (
            <section key={item.q} className="card">
              <h2 className="text-lg font-bold text-gray-900 mb-2">{item.q}</h2>
              <p className="text-gray-600 leading-relaxed">{item.a}</p>
            </section>
          ))}
        </div>
      </article>
      <JoinCta />
    </PublicLayout>
  );
}
