import { useLanguage } from '../context/LanguageContext';
import { forBusinessesContent } from '../content/publicContent';
import PublicLayout, { JoinCta } from '../components/PublicLayout';
import ContentSections from '../components/ContentSections';

export default function ForBusinessesPage() {
  const { lang } = useLanguage();

  return (
    <PublicLayout>
      <ContentSections content={forBusinessesContent[lang]} />
      <JoinCta />
    </PublicLayout>
  );
}
