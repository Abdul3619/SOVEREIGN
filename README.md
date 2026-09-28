# Sovereign Grand Hotel

I built this hotel website and management platform for a luxury hotel concept, the Sovereign Grand Hotel & Spa. Guests can browse rooms, suites and villas, book online, and manage their bookings, invoices and notifications from a guest portal. Staff get a dashboard covering rooms, categories, bookings (approve, reject, cancel), customers and payments, with access based on role (super admin, hotel manager, receptionist, accountant).

## Stack

- React 19, Vite, Tailwind CSS 4, Motion
- Express server (`server.ts`) serving the API and the built frontend
- PostgreSQL (Cloud SQL or any Postgres) through Drizzle ORM (`src/db`)
- Firebase Authentication with Google sign-in (`src/lib/firebase.ts`, verified on the server in `src/middleware/auth.ts`)

## Running it locally

You need Node.js, a PostgreSQL database and a Firebase project with Google sign-in enabled.

```bash
npm install
cp .env.example .env   # fill in the database settings
npm run dev            # http://localhost:3000
```

The Firebase web settings live in `firebase-config.json`. These values are public by design.

On startup, the server creates sample data (rooms, services, gallery) if the database is empty. See `src/db/seed.ts`.

| Variable | Purpose |
| --- | --- |
| `SQL_HOST`, `SQL_DB_NAME`, `SQL_USER`, `SQL_PASSWORD` | Database connection used by the app |
| `SQL_ADMIN_USER`, `SQL_ADMIN_PASSWORD` | Used by Drizzle (`src/db/drizzle.config.ts`) for schema changes |

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Express + Vite dev server |
| `npm run build` | Builds the frontend into `dist/` and bundles the server into `dist/server.cjs` |
| `npm start` | Runs the production build |
| `npm run lint` | Type-checks the project |

## Status

This is a demo: the rooms, services and reviews are sample content. The Vercel project only serves the built frontend. The Express API in `server.ts` (bookings, guest portal, staff dashboard) needs a Node host with a Postgres database, and that part isn't deployed yet.
