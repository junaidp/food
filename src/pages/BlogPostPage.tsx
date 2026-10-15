import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { matchPublicRoute, localizedPath } from '../lib/seo';
import { formatDate } from '../lib/formatDate';
import { postsFor, readingMinutes } from '../content/blog';
import { blogIntro, pageText } from '../content/publicContent';
import PublicLayout, { JoinCta } from '../components/PublicLayout';
import RichText from '../components/RichText';
import BlogPostCard from '../components/BlogPostCard';
import NotFoundPage from './NotFoundPage';

export default function BlogPostPage() {
  const { pathname } = useLocation();
  const { lang } = useLanguage();
  const post = matchPublicRoute(pathname)?.post;
  if (!post) return <NotFoundPage />;

  const labels = blogIntro[lang];
  const related = postsFor(lang).filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <PublicLayout>
      <article className="max-w-3xl mx-auto px-4 pt-10">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
          <ol className="flex flex-wrap gap-2">
            <li><Link to={localizedPath('home', lang)} className="hover:text-primary-700">{pageText.home[lang].navLabel}</Link> /</li>
            <li><Link to={localizedPath('blog', lang)} className="hover:text-primary-700">{pageText.blog[lang].navLabel}</Link> /</li>
            <li aria-current="page" className="text-gray-700">{post.title}</li>
          </ol>
        </nav>

        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">{post.title}</h1>
        <p className="text-sm text-gray-500 mb-8">
          {labels.published} <time dateTime={post.datePublished}>{formatDate(post.datePublished, lang)}</time> ·{' '}
          {readingMinutes(post)} {labels.minRead}
        </p>

        <div className="text-lg text-gray-700 leading-relaxed space-y-4 mb-10">
          {post.intro.map((p) => (
            <p key={p}><RichText text={p} /></p>
          ))}
        </div>

        {post.sections.map((section) => {
          const List = section.ordered ? 'ol' : 'ul';
          return (
            <section key={section.heading} className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.heading}</h2>
              {section.list && (
                <List className={`${section.ordered ? 'list-decimal' : 'list-disc'} ps-6 space-y-2 text-gray-700 leading-relaxed mb-4`}>
                  {section.list.map((item) => (
                    <li key={item}><RichText text={item} /></li>
                  ))}
                </List>
              )}
              {section.paragraphs?.map((p) => (
                <p key={p} className="text-gray-700 leading-relaxed mb-4"><RichText text={p} /></p>
              ))}
            </section>
          );
        })}
      </article>

      {related.length > 0 && (
        <section className="max-w-3xl mx-auto px-4 pt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{labels.related}</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {related.map((p) => (
              <BlogPostCard key={p.slug} post={p} lang={lang} />
            ))}
          </div>
        </section>
      )}

      <JoinCta />
    </PublicLayout>
  );
}
