import type { ComponentType } from 'react';
import type { RouteKind } from '../lib/seo';
import LandingPage from './LandingPage';
import HowItWorksPage from './HowItWorksPage';
import FaqPage from './FaqPage';
import AboutPage from './AboutPage';
import FoodSafetyPage from './FoodSafetyPage';
import ForBusinessesPage from './ForBusinessesPage';
import BlogIndexPage from './BlogIndexPage';
import BlogPostPage from './BlogPostPage';

// Rendered both by the app and by the build-time pre-renderer (src/entry-server.tsx),
// so these pages must not depend on auth or browser-only APIs during render.
export const PUBLIC_PAGE_COMPONENTS: Record<RouteKind, ComponentType> = {
  home: LandingPage,
  howItWorks: HowItWorksPage,
  faq: FaqPage,
  about: AboutPage,
  foodSafety: FoodSafetyPage,
  forBusinesses: ForBusinessesPage,
  blog: BlogIndexPage,
  blogPost: BlogPostPage,
};
