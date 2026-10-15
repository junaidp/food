import { useLanguage } from '../context/LanguageContext';
import { howItWorksContent } from '../content/publicContent';
import PublicLayout, { JoinCta } from '../components/PublicLayout';
import ContentSections from '../components/ContentSections';

export default function HowItWorksPage() {
  const { lang } = useLanguage();

  return (
    <PublicLayout>
      <ContentSections content={howItWorksContent[lang]} />
      <JoinCta />
    </PublicLayout>
  );
}
