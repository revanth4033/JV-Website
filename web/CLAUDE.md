# CLAUDE.md

Guidance for working in this app. This is the Next.js application (the whole live site); it lives in the `web/` subdirectory of the repo. Run all commands from here (`web/`). The repo-root `README.md` describes an older static HTML prototype; ignore it for the live app.

## What this is

JV Ventures marketing site: **Next.js 16 (App Router) + React 19 + TypeScript** with a **fully custom, self-owned CMS** on **Prisma + PostgreSQL**. No third-party CMS framework. Original **GSAP + ScrollTrigger + Lenis** scroll animations. Brand: blue gradient `#2769DD → #0C2758`, red `#DA2128`, Montserrat.

## Commands (run from `web/`)

```bash
docker compose up -d     # Postgres on localhost:5439
npm install              # postinstall runs prisma generate
npm run db:push          # sync schema to DB
npm run seed             # import inventory.json + create admin user
npm run dev              # http://localhost:3000  (admin: /admin)

npm test                 # vitest (auth + sanitize unit tests)
npm run lint             # eslint (next core-web-vitals + TS)
npm run db:studio        # browse the DB
```

Seed admin: `admin@jv.ventures` (password from `SEED_ADMIN_PASSWORD`, else randomly generated and printed once).

## Architecture

- **Public site** — `src/app/(frontend)/`: home, about, team, contact, `platform/[slug]`. Server Components load content via `@/content/db`, pass into `'use client'` presentational components in `src/components/<page>/`. ISR `revalidate = 30` (300 for platform index/sitemap).
- **Admin CMS** — `src/app/(admin)/admin/`: login, dashboard, per-section editors, media, history, account. Schema-driven forms, draft/publish/schedule, revisions, roles.
- **Preview** — `src/app/(preview)/`: live admin preview via `postMessage`; reuses the exact production components.
- **Content layer** — `src/content/`: `db.ts → source.ts → sources/custom.ts` reads Prisma and **falls back to bundled `inventory.json`** when the DB is empty/unreachable, so the public site always renders. Shapes in `content/types.ts`.
- **Cron** — `src/app/api/cron/publish/route.ts` promotes scheduled drafts (`vercel.json`, daily 03:00 UTC).

## The CMS content model (important)

`Singleton` (siteSettings/homePage/aboutPage/teamPage/contactPage) and `Platform` rows each carry three fields:
- `data` — published content the public site renders
- `draft` — unpublished edits (nullable)
- `publishAt` — scheduled go-live time (nullable; the cron scans this)

Editors read `draft ?? data ?? codeDefault`. **Publish** clears the draft and snapshots a `Revision` (30 kept per entity, one-click rollback via History). Content is stored as JSON matching `content/types.ts`, so the read path is a near-passthrough.

## Conventions & gotchas

- **Server-only content reads** go through `@/content/db` / `@/content/source` — don't import Prisma directly in components. Files that touch the DB use `import 'server-only'`.
- **Every content save is sanitized** (`src/lib/sanitize.ts`, `sanitizeContent`) — allowlists only `strong/em/b/i/br` + `em.soi`. Re-applied on save, restore, and scheduled publish. Keep this in the write path for any new content mutation.
- **Auth**: JWT (jose) in `jv_session` cookie. Middleware does a coarse signature check; `getSession()` (`src/lib/session.ts`) is the real gate — it re-checks the DB and rejects on `tokenVersion` mismatch (the revocation seam). Admin-only actions guard via `guardAdmin`/`requireAdmin`.
- **Fail-closed env**: app refuses to boot without `AUTH_SECRET` outside dev; cron 503s without `CRON_SECRET`. See `.env.example`.
- **Reduced motion**: `SmoothScroll` exposes `{ lenis, reduced }`; every GSAP component early-returns `if (reduced)` and sets final states. Honor this in new animations.
- **Media** (`admin/media-actions.ts`): validates by magic bytes (not client MIME), **SVG excluded**, sharp-optimizes, sha256-dedups. Stores to Vercel Blob if `BLOB_READ_WRITE_TOKEN` set, else local `public/uploads/`. This action file is the single disk↔bucket swap point.
- **Forms are schema-driven**: to add/change an admin field, edit `src/components/admin/schemas.ts` (field defs) — the `Form.tsx` engine renders it. Don't hand-write form JSX.
- **Contact page uses a Google Maps iframe**; `OfficeMap.tsx` (Mapbox) exists but is currently unused.
- **DB migrations**: prefer generating Prisma migrations; `scripts/db-deploy.mjs` runs `migrate deploy` on build and handles P3005/P3009 drift. History drifted early (project used `db push`), so keep migrations idempotent.

## Before committing

Run `npm test` and `npm run lint` from `web/`. Match the surrounding code's style (heavily commented in the animation and auth/security paths for a reason — preserve the intent notes).
