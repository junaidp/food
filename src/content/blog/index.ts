import type { Language } from '../../lib/translations';
import type { BlogPost } from './types';
import findFreeFood from './find-free-food-near-me';
import leftoverIdeas from './leftover-food-ideas';
import shareWithNeighbours from './share-food-with-neighbours';
import foodWasteAtHome from './food-waste-at-home';
import ramadanSharing from './ramadan-food-sharing';
import eventLeftovers from './leftover-food-after-event';
import urBachaHuaKhana from './ur-bacha-hua-khana';
import urQareebMuftKhana from './ur-qareeb-muft-khana';

export type { BlogPost, BlogSection } from './types';

// To add a post: create a file in this folder and list it here. It is pre-rendered,
// added to the sitemap and shown on /blog (or /ur/blog) on the next build.
export const BLOG_POSTS: BlogPost[] = [
  findFreeFood,
  leftoverIdeas,
  shareWithNeighbours,
  foodWasteAtHome,
  ramadanSharing,
  eventLeftovers,
  urBachaHuaKhana,
  urQareebMuftKhana,
];

export function blogPostPath(post: BlogPost): string {
  return post.lang === 'en' ? `/blog/${post.slug}` : `/${post.lang}/blog/${post.slug}`;
}

export function postsFor(lang: Language): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.lang === lang).sort((a, b) => b.datePublished.localeCompare(a.datePublished));
}

export function readingMinutes(post: BlogPost): number {
  const text = [...post.intro, ...post.sections.flatMap((s) => [s.heading, ...(s.paragraphs ?? []), ...(s.list ?? [])])].join(' ');
  return Math.max(1, Math.round(text.split(/\s+/).length / 200));
}
