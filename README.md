# Veritas Pathways Frontend

Next.js (App Router) site for Veritas Pathways: the public pages and the admin dashboard.

## Setup

```bash
npm install
cp .env.example .env   # set NEXT_PUBLIC_API_BASE_URL
npm run dev            # http://localhost:3000
```

`NEXT_PUBLIC_API_BASE_URL` is the backend API including `/api/v1`, e.g.
`http://localhost:5000/api/v1` locally. On Vercel, set it in the project's
environment variables.

## Scripts

- `npm run dev`: development server
- `npm run build`: production build
- `npm start`: serve the production build
- `npm run lint`: ESLint

## Structure

- `src/app/`: routes. `(site)/` holds the public pages, `dashboard/` the admin area.
- `src/views/`: page components used by the routes.
- `src/Main/`: navbar, footer and dashboard shell.
- `src/proxy.js`: redirects signed-out visitors from `/dashboard` to `/login`.
- `src/config/api.js`: API client.

## Search engines

The site is currently kept out of search engines in three places: the `robots`
metadata in `src/app/layout.jsx`, the `X-Robots-Tag` header in `next.config.mjs`,
and `public/robots.txt`. Change all three when it should be indexed.
