import { useLanguage } from '../context/LanguageContext';
import { foodSafetyContent } from '../content/publicContent';
import PublicLayout, { JoinCta } from '../components/PublicLayout';
import ContentSections from '../components/ContentSections';

export default function FoodSafetyPage() {
  const { lang } = useLanguage();

  return (
    <PublicLayout>
      <ContentSections content={foodSafetyContent[lang]} />
      <JoinCta />
    </PublicLayout>
  );
}
