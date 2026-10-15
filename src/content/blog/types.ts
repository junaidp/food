import type { Language } from '../../lib/translations';

// Paragraphs and list items may contain links written as [label](/path).
export interface BlogSection {
  heading: string;
  paragraphs?: string[];
  list?: string[];
  ordered?: boolean;
}

export interface BlogPost {
  slug: string; // URL: /blog/<slug> (English) or /ur/blog/<slug> (Urdu)
  lang: Language;
  title: string; // the H1
  metaTitle: string; // <title>, ~60 characters
  description: string; // meta description, ~155 characters
  excerpt: string; // shown on the blog index
  datePublished: string; // YYYY-MM-DD
  dateModified?: string;
  intro: string[];
  sections: BlogSection[];
}
