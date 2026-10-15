import { useLanguage } from '../context/LanguageContext';
import { blogIntro } from '../content/publicContent';
import { postsFor } from '../content/blog';
import PublicLayout, { JoinCta } from '../components/PublicLayout';
import BlogPostCard from '../components/BlogPostCard';

export default function BlogIndexPage() {
  const { lang } = useLanguage();
  const intro = blogIntro[lang];

  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto px-4 pt-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">{intro.h1}</h1>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl">{intro.intro}</p>
        <div className="grid sm:grid-cols-2 gap-6">
          {postsFor(lang).map((post) => (
            <BlogPostCard key={post.slug} post={post} lang={lang} />
          ))}
        </div>
      </div>
      <JoinCta />
    </PublicLayout>
  );
}
