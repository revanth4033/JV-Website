# JV Ventures — Migration Plan: Static Site → Next.js + Payload CMS

> Status: approved direction. Convert the current static HTML/CSS/JS prototype into a
> production frontend with a fully self-owned CMS, where **every word, image, video,
> number, and link** is editable by a non-developer — with the signature scroll
> animations preserved exactly.

## Decisions (locked)

| Decision | Choice |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| CMS | **Payload CMS** — self-hosted inside the same Next.js app (we own code + data) |
| Database | PostgreSQL (managed: Neon or Supabase) |
| Editing UX | Structured forms |
| Media storage | Object storage (Cloudflare R2 or Vercel Blob); DB stores references |
| Animations | Keep identical — GSAP + ScrollTrigger + Lenis via `@gsap/react` |
| Styling | Port existing `styles.css` as-is (global CSS + CSS Modules), keep `:root` tokens |
| Publishing | Draft → preview → publish (Payload drafts + versions) |
| Hosting | Vercel (frontend) + managed Postgres + object storage |

## Why this shape
- Static HTML can't be edited by non-developers and has SEO/image gaps.
- Payload is a custom CMS that runs *inside our own Next.js app on our own Postgres* —
  full ownership, while getting admin UI, auth, roles, media upload/crop, drafts,
  versioning, and audit log out of the box. We define every schema/field.
- The existing `platform.js` `PLATFORMS` object is already a content model — proof the
  content maps cleanly to structured schemas.

---

## Content model → Payload structure

**Globals (singletons):**
- `siteSettings` — logo, full nav (incl. 4 platform dropdown items: name + sector),
  footer (locations, links, email, social), recurring closing quote, bridge image, default SEO.
- `homePage` — 4 deck slides (kicker, title w/ emphasis, copy, CTA, visuals), SOI orbit
  tiles (×4), impact stat cards (×4: value + suffix + label), platform strips (×4: image,
  tab, logo, stat, description), rail chapter labels.
- `aboutPage` — hero (title lines, subtitle, intro, 4 sector chips, image, 4 ledger stats),
  3 belief rows, 4 method cards, 4 model rows + 4 stage images, 4 ecosystem tiles,
  GRIDS morph (image, 2 labels, 6 layers).

**Collections:**
- `platforms` — 4 docs (powered/powerx/powercare/powerpod): name, sector, wordmark, hero,
  video, tagline, intro, totals[], categories[] → ventures[] (name, logo, photo, desc,
  metrics[]). Mirrors the existing `PLATFORMS` object exactly.
- `media` — Payload upload collection (alt text, focal point, auto-derived sizes).
- `users` — Payload auth (roles: admin, editor).

**Field types that matter:**
- Titles that reveal line-by-line → structured "lines" array (not one string).
- Stats/count-ups → split `{ value, suffix, label }` so the animation can target the number.
- Emphasis text (`<strong>`/`<em>`) → Payload `richText` with constrained marks.
- All images/videos → `upload` relationships to `media`.
- Length limits + editor hints on fields that feed pinned scroll layouts.

---

## Phased roadmap (~6–7 weeks)

### Phase 0 — Content audit (2–3 d)
Extract every string/asset from the 3 pages into a reviewable inventory (JSON/sheet).
**This is the "nothing is lost" sign-off artifact.** Map each item to a future field.

### Phase 1 — Scaffold (2–3 d)
Next.js + TS + Payload + Postgres + object storage + auth, deploy pipeline, port design
tokens and global CSS. Empty admin loads; one placeholder page renders.

### Phase 2 — Component port (1.5–2 wk)
Rebuild all 3 pages as React components with **animations identical** (deck, theater mode,
GRIDS morph, SOI orbit, count-ups), content still hardcoded. QA motion/visual parity vs.
the original prototype before any CMS wiring.

### Phase 3 — Payload schemas (2–3 d)
Define globals + collections + field validation mirroring the Phase 0 inventory.

### Phase 4 — Admin forms (4–6 d)
Configure/tune the structured forms, field groups, previews, and editor guidance.

### Phase 5 — Content migration (2–3 d)
**Scripted** import of all Phase 0 content into Payload — no manual retyping, nothing missed.

### Phase 6 — Wire public site (3–4 d)
Components read from Payload (Local API), `next/image` for all media, draft preview +
on-demand revalidation on publish.

### Phase 7 — Roles, audit, media UX (built-in, light tuning)
Editor vs admin roles, image upload/crop/focal point, versioning/restore.

### Phase 8 — QA (3–4 d)
Responsive, `prefers-reduced-motion`, SEO + Open Graph, favicon, Lighthouse, cross-browser,
and an **editor acceptance test** (client edits a word + swaps an image end-to-end).

### Phase 9 — Launch (1–2 d)
DNS, redirects from old URLs, analytics, backups.

---

## Fixes folded in along the way (from the prototype audit)
- Add `<meta description>`, Open Graph/Twitter cards, canonical URLs (now CMS-driven per page).
- Reference the existing `favicon.png`.
- `next/image` with `srcset`, explicit dimensions, lazy-loading (fixes unoptimized images).
- Real Team page + working LinkedIn/contact (currently `href="#"` placeholders).

## Top risks & mitigations
1. **GSAP ↔ DOM coupling** — port with `useGSAP`/`gsap.context` cleanup; QA each page vs. original.
2. **Variable content length breaking pinned layouts** — field length limits + editor guidelines.
3. **Rich emphasis in titles** — structured line arrays / constrained richText + serializers.

## Immediate next step
Begin **Phase 0**: produce the full content inventory from the current code for sign-off.
