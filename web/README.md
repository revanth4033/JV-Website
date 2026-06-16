# JV Ventures — Next.js + Custom CMS

Production rebuild of the JV Ventures site: a Next.js (App Router) marketing site with the
original GSAP/Lenis scroll animations, plus a **fully custom, self-owned CMS** built on
Prisma + PostgreSQL. No third-party CMS framework — every line is ours.

## Stack
- **Next.js 16** + React 19 + TypeScript
- **PostgreSQL** + **Prisma** (ORM)
- Custom admin at `/admin` — auth (JWT cookie + bcrypt), structured forms (react-hook-form)
- **GSAP + ScrollTrigger + Lenis** scroll animations (unchanged)
- Media: local disk in dev (`/public/uploads`); S3/R2 in production

## Local setup
```bash
docker compose up -d        # Postgres on localhost:5439
npm install                 # (postinstall runs prisma generate)
npm run db:push             # sync schema to the database
npm run seed                # load all content + create admin user
npm run dev                 # http://localhost:3000  (admin: /admin)
```

**Admin login:** `admin@jv.ventures` / `changeme-jv-2026` (change after first login).

## Scripts
| Script | Purpose |
|---|---|
| `npm run dev` / `build` / `start` | Dev / production build / serve |
| `npm run db:push` | Sync the Prisma schema to Postgres |
| `npm run db:studio` | Prisma Studio (browse the database) |
| `npm run seed` | Import `content/inventory.json` + create the admin user |

## How the CMS works
- **Data model** (`prisma/schema.prisma`): `Singleton` (siteSettings/homePage/aboutPage as
  JSON), `Platform` (one row each), `Media`, `User`.
- **Public site** reads through `src/content/db.ts`, which returns the same shapes the
  components already use (falls back to the bundled inventory if the DB is empty).
- **Admin** (`src/app/(admin)`): a generic, schema-driven form engine
  (`src/components/admin/form`) renders clean labeled forms from field definitions in
  `src/components/admin/schemas.ts`. Saving writes JSON to Postgres and revalidates the
  affected pages (edits go live within ~30s via ISR).
- **Media**: upload in the admin → stored in `/public/uploads` and the `Media` table → pick
  in any image field.

## Project layout
```
prisma/schema.prisma         database schema
src/
  app/(frontend)/            public marketing site (reads from db.ts)
  app/(admin)/admin/         the CMS (login, dashboard, section editors, media)
  components/admin/          form engine, schemas, media manager, shell
  content/db.ts              Prisma data layer (public reads)
  content/types.ts           shared content shapes
  lib/{prisma,auth,session}  db client + auth helpers
  seed/index.ts              content importer
```

## Production notes
- Set `DATABASE_URI` (managed Postgres: Neon/Supabase/RDS), `AUTH_SECRET` (long random),
  `NEXT_PUBLIC_SERVER_URL`.
- Move media uploads to object storage (S3/R2) — the upload action in
  `src/app/(admin)/admin/media-actions.ts` is the single place to swap disk → bucket.
- Run `npm run db:push` (or generate Prisma migrations) and `npm run seed` once on first deploy.
- Old prototype URLs (`/index.html`, `/about.html`, `/platform.html?p=…`) redirect to the new
  routes (see `next.config.ts`).
