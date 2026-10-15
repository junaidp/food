// Build-time renderer for the public pages; used by scripts/prerender.mjs, never shipped to browsers.
import { Suspense } from 'react';
import { renderToString } from 'react-dom/server';
import { Routes, Route } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import { LanguageProvider } from './context/LanguageContext';
import { PUBLIC_PAGE_COMPONENTS } from './pages/publicPages';
import { PUBLIC_ROUTES, matchPublicRoute, getPageMeta, renderHeadTags, buildSitemap, buildRobots, SITE_URL } from './lib/seo';

export { PUBLIC_ROUTES, buildSitemap, buildRobots, SITE_URL };

export function render(url: string) {
  const route = matchPublicRoute(url);
  if (!route) throw new Error(`Not a public route: ${url}`);

  // Mirrors the client tree from App.tsx (Suspense > Routes) so hydration matches.
  const html = renderToString(
    <StaticRouter location={url}>
      <LanguageProvider>
        <Suspense fallback={null}>
          <Routes>
            {PUBLIC_ROUTES.map(({ path, page }) => {
              const Page = PUBLIC_PAGE_COMPONENTS[page];
              return <Route key={path} path={path} element={<Page />} />;
            })}
          </Routes>
        </Suspense>
      </LanguageProvider>
    </StaticRouter>
  );

  return {
    html,
    head: renderHeadTags(getPageMeta(url, route.lang)),
    lang: route.lang,
    dir: route.lang === 'ur' ? 'rtl' : 'ltr',
  };
}

// Head for the app shell served on sign-in and dashboard URLs.
export function renderShellHead() {
  return renderHeadTags(getPageMeta('/app', 'en'));
}
