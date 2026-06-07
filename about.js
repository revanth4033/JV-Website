/* ============================================================
   JV VENTURES — About page motion system
   Shares the grammar of main.js: one easing, 3 durations.
   Single pinned moment: the GRIDS morph (fragmented → integrated).
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const EASE = "power3.out";

/* ---------- smooth scroll ---------- */
if (!REDUCED) {
  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  window.__lenis = lenis;
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ---------- the red thread ---------- */
gsap.to(".thread-line", {
  scaleY: 1,
  ease: "none",
  scrollTrigger: { trigger: "main", start: "top top", end: "bottom bottom", scrub: 0.4 },
});
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

/* ---------- masked line reveals ---------- */
document.querySelectorAll(".line-inner").forEach((el, i) => {
  gsap.to(el, {
    y: 0,
    duration: REDUCED ? 0 : 1.2,
    ease: EASE,
    delay: el.closest("[data-hero]") ? 0.15 + (i % 6) * 0.12 : 0,
    scrollTrigger: el.closest("[data-hero]")
      ? null
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

/* ---------- ledger counters (once, on enter) ---------- */
document.querySelectorAll(".ledger-num").forEach((el) => {
  const target = +el.dataset.count;
  const prefix = el.dataset.prefix || "";
  const suffix = el.dataset.suffix || "";
  const plain = el.hasAttribute("data-plain"); // years: no thousands separator
  const fmt = (v) => prefix + (plain ? Math.round(v) : Math.round(v).toLocaleString("en-IN")) + suffix;
  if (REDUCED) { el.textContent = fmt(target); return; }
  const obj = { v: 0 };
  ScrollTrigger.create({
    trigger: el, start: "top 88%", once: true,
    onEnter: () =>
      gsap.to(obj, {
        v: target, duration: 1.4, ease: "power2.out",
        onUpdate: () => (el.textContent = fmt(obj.v)),
      }),
  });
});

/* ---------- belief rows: focus follows the reader ---------- */
document.querySelectorAll(".belief-row").forEach((row) => {
  if (REDUCED) { row.classList.add("focus"); return; }
  ScrollTrigger.create({
    trigger: row,
    start: "top 72%",
    end: "bottom 28%",
    toggleClass: { targets: row, className: "focus" },
  });
});

/* ---------- method deck: sheets settle back as the next stage covers them ---------- */
(() => {
  const cards = gsap.utils.toArray(".dcard");
  if (!cards.length || REDUCED) return;
  cards.forEach((card, i) => {
    const next = cards[i + 1];
    if (!next) return;
    const shade = card.querySelector(".dshade");
    // transform + element opacity only — pure compositor work.
    // scrub: true → no extra smoothing on top of Lenis (double-lag otherwise)
    const st = {
      trigger: next,
      start: "top bottom",
      end: "top 25%",
      scrub: true,
    };
    gsap.to(card, { scale: 0.95, ease: "none", scrollTrigger: st });
    gsap.to(shade, { opacity: 0.55, ease: "none", scrollTrigger: { ...st } });
  });
})();

/* ---------- models: sticky stage follows the active row ---------- */
(() => {
  const rows = gsap.utils.toArray(".model-split .model-row");
  const imgs = gsap.utils.toArray(".stage-img");
  if (!rows.length) return;

  const activate = (i) => {
    rows.forEach((r, j) => r.classList.toggle("focus", j === i));
    imgs.forEach((img, j) => img.classList.toggle("active", j === i));
  };

  if (REDUCED) { activate(0); rows.forEach((r) => r.classList.add("focus")); return; }

  rows.forEach((row, i) => {
    ScrollTrigger.create({
      trigger: row,
      start: "top 60%",
      end: "bottom 40%",
      onToggle: (self) => self.isActive && activate(i),
    });
    row.addEventListener("mouseenter", () => activate(i));
  });
  activate(0);
})();

/* ---------- GRIDS morph: pan from fragmented to integrated ---------- */
(() => {
  const img = document.querySelector(".morph-img");
  const window_ = document.querySelector(".morph-window");
  if (!img) return;

  const layers = gsap.utils.toArray(".mlayer");

  if (REDUCED) {
    // static end state: integrated city framed, layers visible
    gsap.set(img, { xPercent: -40, filter: "none" });
    gsap.set(layers, { opacity: 1, y: 0 });
    gsap.set(".morph-label.label-a", { opacity: 0 });
    gsap.set(".morph-label.label-b", { opacity: 1 });
    return;
  }

  // initial state: framed on the fragmented left, desaturated
  gsap.set(img, { filter: "grayscale(0.7) brightness(0.75)" });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".morph-stage",
      start: "top top",
      end: "+=180%",
      pin: true,
      scrub: 0.5,
    },
  });

  // how far the image can pan: width overflow relative to its window
  const pan = () => {
    const overflow = img.scrollWidth - window_.clientWidth;
    return overflow > 0 ? -overflow : 0;
  };

  tl.to(img, { x: pan, filter: "grayscale(0) brightness(1)", ease: "none", duration: 3 }, 0)
    .to(".morph-label.label-a", { opacity: 0, duration: 0.5, ease: EASE }, 1.1)
    .fromTo(".morph-label.label-b", { opacity: 0 }, { opacity: 1, duration: 0.5, ease: EASE }, 1.5)
    .to(layers, { opacity: 1, y: 0, stagger: 0.18, duration: 0.5, ease: EASE }, 2.2);

  window.addEventListener("resize", () => ScrollTrigger.refresh());
})();

/* ---------- closing bridge: same finale as home ---------- */
(() => {
  const img = document.querySelector(".close-bridge img");
  if (!img || REDUCED) return;
  gsap.to(img, {
    clipPath: "inset(0 0% 0 0)",
    duration: 1.8,
    ease: "power2.inOut",
    scrollTrigger: { trigger: ".act-close", start: "top 55%", once: true },
  });
  gsap.from(".close-bridge", {
    yPercent: 30, ease: "none",
    scrollTrigger: { trigger: ".act-close", start: "top bottom", end: "top 20%", scrub: 0.4 },
  });
})();

/* ---------- placeholder links ---------- */
document.querySelectorAll('a[href="#"]').forEach((a) =>
  a.addEventListener("click", (e) => e.preventDefault())
);

/* ---------- smart header: backdrop on scroll, tuck on scroll-down ---------- */
(() => {
  const header = document.querySelector(".site-header");
  if (!header) return;
  let lastY = 0;
  const onScroll = (y) => {
    header.classList.toggle("scrolled", y > 40);
    header.classList.toggle("tucked", y > lastY + 2 && y > 260);
    if (y < lastY - 2) header.classList.remove("tucked");
    lastY = y;
  };
  if (window.__lenis) window.__lenis.on("scroll", (e) => onScroll(e.scroll));
  else window.addEventListener("scroll", () => onScroll(window.scrollY), { passive: true });
})();
