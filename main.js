/* ============================================================
   JV VENTURES — homepage prototype motion system
   GSAP ScrollTrigger + Lenis · one easing · 3 durations
   Pinned moments: Act 1 (impact chapters) + Act 2 (GRIDS scrub)
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const EASE = "power3.out";

/* ---------- smooth scroll (Lenis) ---------- */
if (!REDUCED) {
  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ---------- the red thread: page progress ---------- */
gsap.to(".thread-line", {
  scaleY: 1,
  ease: "none",
  scrollTrigger: { trigger: "main", start: "top top", end: "bottom bottom", scrub: 0.4 },
});

/* act label tracking */
document.querySelectorAll("[data-act]").forEach((sec) => {
  ScrollTrigger.create({
    trigger: sec,
    start: "top 50%",
    end: "bottom 50%",
    onToggle: (self) => {
      if (!self.isActive) return;
      document.getElementById("act-index").textContent = sec.dataset.act;
      document.getElementById("act-name").textContent = sec.dataset.actName;
    },
  });
});

/* ---------- masked line reveals (one-shot) ---------- */
document.querySelectorAll(".line-inner").forEach((el, i) => {
  gsap.to(el, {
    y: 0,
    duration: REDUCED ? 0 : 1.2,
    ease: EASE,
    delay: el.closest(".act-hero") ? 0.15 + (i % 6) * 0.12 : 0,
    scrollTrigger: el.closest(".act-hero")
      ? null // hero animates on load
      : { trigger: el.closest(".line"), start: "top 88%", once: true },
  });
});
document.querySelectorAll(".reveal").forEach((el) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: REDUCED ? 0 : 0.7,
    ease: EASE,
    scrollTrigger: { trigger: el, start: "top 88%", once: true },
  });
});

/* ============ ACT 1 · pinned impact chapters ============ */
(() => {
  const stage = document.querySelector(".impact-stage");
  const slides = gsap.utils.toArray(".impact-slide");
  const dots = gsap.utils.toArray(".impact-progress .dot");
  const counted = new Set();
  let current = -1;

  const countUp = (slide) => {
    if (counted.has(slide)) return;
    counted.add(slide);
    const numEl = slide.querySelector(".num");
    const target = +slide.dataset.count;
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target,
      duration: REDUCED ? 0 : 1.2,
      ease: "power2.out",
      onUpdate: () => (numEl.textContent = Math.round(obj.v).toLocaleString("en-IN")),
    });
  };

  const activate = (i) => {
    if (i === current) return;
    current = i;
    slides.forEach((s, j) => s.classList.toggle("active", j === i));
    dots.forEach((d, j) => d.classList.toggle("active", j === i));
    countUp(slides[i]);
  };

  if (REDUCED) {
    // no pin: show all four as stacked static frames
    slides.forEach((s) => {
      s.style.position = "relative";
      s.classList.add("active");
      s.querySelector(".num").textContent = (+s.dataset.count).toLocaleString("en-IN");
    });
    stage.style.height = "auto";
    return;
  }

  ScrollTrigger.create({
    trigger: ".act-impact",
    start: "top top",
    end: "+=" + slides.length * 100 + "%",
    pin: stage,
    onUpdate: (self) => {
      const i = Math.min(slides.length - 1, Math.floor(self.progress * slides.length));
      activate(i);
    },
  });
  activate(0);
})();

/* ============ ACT 2 · GRIDS scroll-scrub ============ */
(() => {
  const layers = gsap.utils.toArray(".grids-layers .layer");

  if (REDUCED) {
    gsap.set(".grids-photo", { filter: "none", scale: 1 });
    layers.forEach((l) => l.classList.add("lit"));
    gsap.set(".grids-cta", { opacity: 1, y: 0 });
    return;
  }
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".grids-stage",
      start: "top top",
      end: "+=160%",
      pin: true,
      scrub: 0.5,
      onUpdate: (self) => {
        // lighting window: layers activate one by one between 12% and 82% of the pin
        const t = (self.progress - 0.12) / 0.7;
        const idx = t < 0 ? -1 : Math.min(layers.length - 1, Math.floor(t * layers.length));
        const settled = self.progress > 0.88; // end state: all lit, none active
        layers.forEach((l, j) => {
          l.classList.toggle("lit", j <= idx);
          l.classList.toggle("active", j === idx && !settled);
        });
      },
    },
  });
  tl.to(".grids-photo", { filter: "grayscale(0) brightness(1)", scale: 1, ease: "none", duration: 3 }, 0)
    .to(".grids-cta", { opacity: 1, y: 0, ease: EASE, duration: 0.5 }, 2.55);
})();

/* ============ ACT 3 · indexed platform rows ============ */
document.querySelectorAll(".platform-row").forEach((row) => {
  const head = row.querySelector(".row-head");
  head.addEventListener("click", () => {
    const isOpen = row.dataset.open === "true";
    // close siblings — one open at a time keeps the index calm
    document.querySelectorAll('.platform-row[data-open="true"]').forEach((r) => {
      r.dataset.open = "false";
      r.querySelector(".row-head").setAttribute("aria-expanded", "false");
    });
    row.dataset.open = String(!isOpen);
    head.setAttribute("aria-expanded", String(!isOpen));
    // let the height transition finish, then refresh pin positions
    setTimeout(() => ScrollTrigger.refresh(), 750);
  });
});

/* ---- hover preview: image follows cursor on the right (dusted-style) ---- */
(() => {
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const preview = document.querySelector(".hover-preview");
  if (!fine || !preview || REDUCED) return;

  const index = document.querySelector(".platform-index");
  const imgs = gsap.utils.toArray(".preview-img");
  const rows = gsap.utils.toArray(".platform-row");
  // smooth cursor-follow on the vertical axis
  const followY = gsap.quickTo(preview, "top", { duration: 0.55, ease: "power3.out" });

  const show = (i) => {
    imgs.forEach((img, j) => img.classList.toggle("active", j === i));
    preview.classList.add("visible");
  };
  const hide = () => preview.classList.remove("visible");

  rows.forEach((row, i) => {
    row.addEventListener("mouseenter", () => {
      // an open row already shows its image in the expanded body
      row.dataset.open === "true" ? hide() : show(i);
    });
  });
  index.addEventListener("mousemove", (e) => {
    const r = index.getBoundingClientRect();
    // clamp so the frame never escapes the section
    const y = gsap.utils.clamp(140, r.height - 140, e.clientY - r.top);
    followY(y);
  });
  index.addEventListener("mouseleave", hide);
  // clicking a row open/closed: re-evaluate visibility
  index.addEventListener("click", () => {
    const hovered = rows.find((r) => r.matches(":hover"));
    if (!hovered || hovered.dataset.open === "true") hide();
    else show(rows.indexOf(hovered));
  });
})();

/* ---- SOI hero visual: entrance, ambient drift, mouse parallax ---- */
(() => {
  const visual = document.querySelector(".soi-visual");
  if (!visual) return;

  if (REDUCED) {
    gsap.set(visual, { opacity: 1 });
    return;
  }

  // entrance: rings settle in, then tiles surface around the core
  gsap.set(visual, { opacity: 1 });
  gsap.from(".soi-rings .ring", {
    scale: 0.9, opacity: 0, duration: 1.2, ease: EASE, stagger: 0.12, delay: 0.5,
  });
  gsap.from(".soi-core", { opacity: 0, duration: 0.7, ease: EASE, delay: 0.9 });
  gsap.from(".ring-label", { opacity: 0, duration: 0.7, ease: EASE, stagger: 0.1, delay: 1.1 });
  gsap.from(".soi-tile", {
    opacity: 0, y: 24, duration: 0.7, ease: EASE, stagger: 0.14, delay: 1.2,
  });

  // ambient drift: each tile breathes on its own rhythm
  gsap.utils.toArray(".soi-tile").forEach((tile, i) => {
    gsap.to(tile, {
      y: i % 2 ? 12 : -12,
      duration: 5.5 + i * 0.9,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: 2,
    });
  });

  // mouse parallax: rings shallow, tiles deeper
  const hero = document.querySelector(".act-hero");
  const ringsX = gsap.quickTo(".soi-rings", "x", { duration: 0.8, ease: "power3.out" });
  const ringsY = gsap.quickTo(".soi-rings", "y", { duration: 0.8, ease: "power3.out" });
  hero.addEventListener("mousemove", (e) => {
    const nx = (e.clientX / window.innerWidth - 0.5) * 2;
    const ny = (e.clientY / window.innerHeight - 0.5) * 2;
    ringsX(nx * -14);
    ringsY(ny * -10);
  });

  // scroll exit: the sphere recedes as the story begins
  gsap.to(visual, {
    opacity: 0.15, yPercent: -12, ease: "none",
    scrollTrigger: { trigger: ".act-hero", start: "top top", end: "bottom 30%", scrub: 0.4 },
  });
})();

/* ---- closing bridge: spans into view left-to-right, settles with a drift ---- */
(() => {
  const img = document.querySelector(".close-bridge img");
  if (!img || REDUCED) return;
  gsap.to(img, {
    clipPath: "inset(0 0% 0 0)",
    duration: 1.8,
    ease: "power2.inOut",
    scrollTrigger: { trigger: ".act-close", start: "top 55%", once: true },
  });
  // gentle parallax: the bridge rises slightly as the section settles
  gsap.from(".close-bridge", {
    yPercent: 30, ease: "none",
    scrollTrigger: { trigger: ".act-close", start: "top bottom", end: "top 20%", scrub: 0.4 },
  });
})();

/* placeholder CTAs: prototype is single-page — don't navigate anywhere */
document.querySelectorAll('a[href="#"]').forEach((a) =>
  a.addEventListener("click", (e) => e.preventDefault())
);

/* image scale-settle on platform media when opened is CSS-driven.
   ScrollTrigger refresh on resize for pin accuracy. */
window.addEventListener("resize", () => ScrollTrigger.refresh());
