# Phase 0 — Content Inventory (sign-off)

This is the complete extract of **every editable item** in the prototype. The machine-readable
source of truth is [`inventory.json`](./inventory.json); this page is the human review summary.
Once you confirm nothing here is wrong or missing, it becomes the baseline — and the scripted
import in Phase 5 loads exactly this into the CMS, so no text is ever retyped by hand.

## Coverage

| Area | What's captured | Count |
|---|---|---|
| **Site settings** | Logo, full nav (+ 4 platform dropdown items), footer (locations, 5 links, email, social), recurring closing quote, bridge image, SEO defaults | 1 global |
| **Homepage** | 4-slide deck: kickers, titles, body copy (with emphasis), CTAs, SOI orbit tiles, impact stats, platform strips, rail chapter labels | 4 slides |
| **About page** | Hero (title, subtitle, intro, 4 chips, image, 4 ledger stats), 3 belief rows, 4 method cards, 4 model rows + images, 4 ecosystem tiles, GRIDS morph (image, 2 labels, 6 layers) | 6 sections |
| **Platforms** | name, sector, wordmark, hero, video, tagline, intro, totals, categories → ventures → metrics | 4 platforms, 9 ventures, 30 metrics |

## Notes & decisions baked in
- **Emphasis preserved**: `<em>`, `<strong>`, `<br>`, and `&nbsp;` are kept inline exactly as written.
  In the CMS these become controlled rich-text fields so editors can bold/emphasise safely.
- **Animated titles** (reveal line-by-line) are stored as arrays of lines, e.g. `["Not just", "a venture."]`,
  with an `emphasis` marker for which line is italic/red.
- **Stats** are split into `value` + `suffix` (+ optional `prefix`, `plain`) so the count-up animation
  can target the number while the label/suffix stay editable text.
- **All media** (images, logos, videos) are referenced by their current `assets/...` path; these files
  get uploaded into the CMS media library in Phase 5 and swapped to CMS references.

## Two items that need your input (flagged as `TODO` in the JSON)
1. **SEO meta description + social share (OG) image** — not present in the prototype at all. Needs authoring.
2. **Team page + working LinkedIn/Contact links** — currently placeholders (`href="#"`). Real destinations TBD.

Everything else is fully captured. **Please review and confirm**, then I'll proceed to Phase 1 (scaffold).
