# FoodShare 🍽️ — Share Food, Share Love

A charity food sharing app connecting donors with receivers in Islamabad. Donors share excess food, receivers find and claim it with dignity using unique pickup codes.

## Features

### Donor (🥗)
- Create food listings with quantity (1-2-3 people)
- Pin location on interactive map
- Accept/reject food requests
- Verify pickup with unique 6-digit code
- Toggle availability on/off
- Report/block receivers

### Receiver (🙋)
- View nearby food on interactive map
- Claim food (one serving per person)
- Receive pickup code upon acceptance
- Live navigation to donor location
- Notify donor upon arrival
- Rate donors after pickup

### Admin (🛡️)
- Dashboard with platform statistics
- Approve/block users
- Monitor all listings
- Handle reports and complaints

### PWA Features (📱)
- **Installable** - Add to home screen like a native app
- **Offline Support** - Works without internet connection
- **Fast Loading** - Service worker caches resources
- **Push Notifications** - Real-time updates (coming soon)
- **App-like Experience** - Runs in standalone mode

## Tech Stack
- **Frontend:** React + Vite + TailwindCSS + TypeScript
- **Backend:** Express + TypeScript
- **Database:** PostgreSQL (Supabase)
- **Maps:** Leaflet (OpenStreetMap — free)
- **Real-time:** Socket.IO
- **HTTP Client:** Axios
- **PWA:** Progressive Web App (installable on mobile)

## Project Structure
```
food/
├── src/              # React frontend (Vite SPA)
│   ├── components/   # Shared components (Layout, MapView, Toast)
│   ├── context/      # Auth + Notification providers
│   ├── lib/          # API client, socket, utils
│   └── pages/        # All page components
│       ├── donor/    # Donor dashboard, create listing, claims
│       ├── receiver/ # Map view, claims, tracking
│       └── admin/    # Admin dashboard, users, reports, listings
├── server/           # Express REST API
│   ├── routes/       # Auth, listings, claims, notifications, ratings, reports, admin
│   ├── middleware/    # Auth middleware
│   ├── db.ts         # PostgreSQL pool
│   ├── socket.ts     # Socket.IO setup
│   └── migrate.ts    # Database migration
├── shared/           # Shared TypeScript types
└── render.yaml       # Render deployment config
```

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment
Create `.env` with:
```
DATABASE_URL=your_supabase_connection_string
JWT_SECRET=your-secret-key
PORT=3001
NODE_ENV=development
```

### 3. Run database migration
```bash
npm run db:migrate
```

### 4. Start development
```bash
npm run dev
```
This starts both frontend (port 5173) and backend (port 3001).

### 5. Default admin login
- Phone: `03001234567`
- Password: `admin123`

## Deployment (Render)

1. Push to GitHub
2. Connect repo on Render
3. It auto-detects `render.yaml`
4. Set `DATABASE_URL` env var in Render dashboard
5. Deploy!

## PWA Installation

Once deployed, users can install FoodShare as a mobile app:

**Android (Chrome):**
1. Visit the website
2. Tap the install banner or "Add to Home Screen"
3. App appears on home screen

**iOS (Safari):**
1. Visit the website
2. Tap Share button
3. Select "Add to Home Screen"
4. App appears on home screen

**Desktop (Chrome/Edge):**
1. Visit the website
2. Click install icon in address bar
3. Or use the install prompt

See `PWA_SETUP.md` for detailed PWA configuration and testing.

## Process Flow
1. **Donor** adds food listing → sets quantity, location, expiry
2. **Receiver** sees food on map → requests it
3. **Donor** gets notified → accepts/rejects
4. On acceptance: unique **6-digit pickup code** generated, 1-hour timer starts
5. Quantity auto-decreases (3 → 2 → 1 → complete)
6. **Receiver** navigates to location → notifies arrival
7. **Donor** verifies pickup code → pickup confirmed
8. **Receiver** can rate donor
