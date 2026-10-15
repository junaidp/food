// Pre-renders the public pages to static HTML so crawlers and link previews see real content.
// Runs after `vite build` (client) and `vite build --ssr src/entry-server.tsx` (renderer).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const clientDir = path.join(root, 'dist/client');
const ssrEntry = path.join(root, 'dist/ssr/entry-server.js');

const { render, renderShellHead, PUBLIC_ROUTES, buildSitemap, buildRobots, SITE_URL } = await import(
  pathToFileURL(ssrEntry).href
);

console.log(`Pre-rendering for ${SITE_URL}`);

const template = fs.readFileSync(path.join(clientDir, 'index.html'), 'utf8');
const SEO_BLOCK = /<!--seo:start-->[\s\S]*?<!--seo:end-->/;
if (!SEO_BLOCK.test(template) || !template.includes('<div id="root"><!--app-html--></div>')) {
  throw new Error('index.html is missing the <!--seo:start/end--> or <!--app-html--> placeholders');
}

function fill({ head, html = '', lang = 'en', dir = 'ltr', prerendered }) {
  const rootAttr = prerendered ? ` data-prerendered="${prerendered}"` : '';
  return template
    .replace('<html lang="en">', `<html lang="${lang}" dir="${dir}">`)
    .replace(SEO_BLOCK, () => head)
    .replace('<div id="root"><!--app-html--></div>', () => `<div id="root"${rootAttr}>${html}</div>`);
}

const fileFor = (route) => (route === '/' ? 'index.html' : `${route.slice(1)}.html`);
const manifest = {};

for (const { path: route } of PUBLIC_ROUTES) {
  const { html, head, lang, dir } = render(route);
  const file = fileFor(route);
  fs.mkdirSync(path.dirname(path.join(clientDir, file)), { recursive: true });
  fs.writeFileSync(path.join(clientDir, file), fill({ head, html, lang, dir, prerendered: route }));
  manifest[route] = file;
  console.log(`  prerendered ${route} → ${file}`);
}

// App shell for sign-in, dashboards and unknown URLs (rendered client-side, kept out of the index).
fs.writeFileSync(path.join(clientDir, 'app.html'), fill({ head: renderShellHead() }));

fs.writeFileSync(path.join(clientDir, 'sitemap.xml'), buildSitemap(new Date().toISOString().slice(0, 10)));
fs.writeFileSync(path.join(clientDir, 'robots.txt'), buildRobots());
fs.writeFileSync(path.join(root, 'dist/prerender-routes.json'), JSON.stringify(manifest, null, 2));

console.log(`✓ prerendered ${PUBLIC_ROUTES.length} pages, app.html, sitemap.xml, robots.txt`);
