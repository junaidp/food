import { Link } from 'react-router-dom';
import type { Language } from '../lib/translations';
import { blogPostPath, readingMinutes, type BlogPost } from '../content/blog';
import { blogIntro } from '../content/publicContent';
import { formatDate } from '../lib/formatDate';

export default function BlogPostCard({ post, lang }: { post: BlogPost; lang: Language }) {
  return (
    <article className="card flex flex-col h-full">
      <p className="text-xs text-gray-400 mb-2">
        {formatDate(post.datePublished, lang)} · {readingMinutes(post)} {blogIntro[lang].minRead}
      </p>
      <h3 className="text-lg font-bold text-gray-900 mb-2">
        <Link to={blogPostPath(post)} className="hover:text-primary-700">{post.title}</Link>
      </h3>
      <p className="text-gray-600 text-sm flex-1">{post.excerpt}</p>
    </article>
  );
}
