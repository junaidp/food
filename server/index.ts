import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/auth.js';
import listingRoutes from './routes/listings.js';
import claimRoutes from './routes/claims.js';
import notificationRoutes from './routes/notifications.js';
import ratingRoutes from './routes/ratings.js';
import reportRoutes from './routes/reports.js';
import adminRoutes from './routes/admin.js';
import { initSocket } from './socket.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const clientPath = path.join(__dirname, '../client');

  // Public pages pre-rendered at build time (see scripts/prerender.mjs): URL path → HTML file
  const manifestPath = path.join(__dirname, '../prerender-routes.json');
  const prerendered: Record<string, string> = fs.existsSync(manifestPath)
    ? JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
    : {};
  const shellFile = fs.existsSync(path.join(clientPath, 'app.html')) ? 'app.html' : 'index.html';

  // Client-side routes that exist; anything else gets the app shell with a 404 status.
  const isAppRoute = (p: string) =>
    /^\/(login|register|verify-otp|notifications|profile)$/.test(p) || /^\/(donor|receiver|admin)(\/|$)/.test(p);

  // /faq.html → /faq (index.html stays reachable: the service worker precaches it)
  const fileToRoute = new Map(
    Object.entries(prerendered).filter(([, file]) => file !== 'index.html').map(([route, file]) => [`/${file}`, route])
  );
  app.use((req, res, next) => {
    const route = fileToRoute.get(req.path);
    if (route && req.method === 'GET') return res.redirect(301, route);
    next();
  });

  app.use(
    express.static(clientPath, {
      index: false,
      redirect: false, // otherwise /ur would redirect to /ur/ because of the ur/ folder

      setHeaders(res, filePath) {
        if (filePath.includes(`${path.sep}assets${path.sep}`)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else if (filePath.endsWith('.html') || filePath.endsWith('sw.js')) {
          res.setHeader('Cache-Control', 'no-cache');
        }
      },
    })
  );

  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ success: false, error: 'Not found' });
    }

    // One URL per page: /faq/ → /faq
    if (req.path.length > 1 && req.path.endsWith('/')) {
      const query = req.originalUrl.includes('?') ? req.originalUrl.slice(req.originalUrl.indexOf('?')) : '';
      return res.redirect(301, req.path.replace(/\/+$/, '') + query);
    }

    res.setHeader('Cache-Control', 'no-cache');
    const page = prerendered[req.path];
    if (page) return res.sendFile(path.join(clientPath, page));

    res.status(isAppRoute(req.path) ? 200 : 404).sendFile(path.join(clientPath, shellFile));
  });
}

// Init Socket.IO
initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
