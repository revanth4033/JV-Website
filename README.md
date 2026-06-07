# JV Ventures — Website Evolution Prototype

High-fidelity motion prototype for the jv.ventures experience evolution.
Preserves the existing brand (blue gradient `#2769DD → #0C2758`, red `#DA2128`,
Montserrat) while elevating layout, storytelling, and motion.

## Pages
- `index.html` — Homepage: SOI sphere hero, pinned impact chapters, GRIDS scrub,
  indexed platform rows with hover preview, bridge close
- `about.html` — About: origin hero + ledger, belief rows, stacking method deck,
  sticky-stage models, ecosystem tiles, GRIDS corridor pan, bridge close

## Stack
Static HTML/CSS/JS · GSAP ScrollTrigger · Lenis smooth scroll (CDN).
Imagery and icons reused from the current jv.ventures site, re-treated for the navy theme.

## Run
```bash
python3 -m http.server 4173
# open http://localhost:4173/
```

Respects `prefers-reduced-motion` (all motion collapses to static layouts).
