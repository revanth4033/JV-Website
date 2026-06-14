/* ============================================================
   JV VENTURES — Platform detail template (data-driven)
   One template, four platforms. ?p=powered|powerx|powercare|powerpod
   ============================================================ */

const PLATFORMS = {
  powered: {
    name: "PowerEd", sector: "Education", wordmark: "assets/plat/wm-powered.png",
    hero: "assets/plat/edu-cappella.jpg", video: "assets/plat/hero-powered.mp4",
    tagline: "An all-encompassing K-12 education platform cultivating vibrant learning environments across the full lifecycle of the education experience.",
    intro: "PowerEd builds the institutions, the operating models, and the everyday services that let schools focus on learning — from the buildings themselves to the buses that reach them.",
    totals: [
      { value: "$500M+", label: "Assets under management" },
      { value: "19K+", label: "Students served" },
      { value: "33", label: "Schools" },
      { value: "4", label: "Operating ventures" },
    ],
    categories: [
      { label: "Infrastructure", ventures: [
        { name: "Cappella", logo: "assets/plat/logo-cappella.png", photo: "assets/plat/edu-cappella.jpg",
          desc: "Pan-Asian edu-infrastructure solutions — sale/leaseback, development, and acquisitions across the spectrum, spanning India and Dubai.",
          metrics: [{ value: "16", label: "Assets" }, { value: "$500M+", label: "AUM" }] },
      ]},
      { label: "Operations", ventures: [
        { name: "Crimson Schools", logo: "assets/plat/logo-crimson.png", photo: "assets/plat/edu-crimson.jpg",
          desc: "Enhancing the mid-market K-12 school experience with a growing South-West India presence.",
          metrics: [{ value: "19K+", label: "Students" }, { value: "16", label: "Schools" }] },
      ]},
      { label: "Services", ventures: [
        { name: "Inventre", logo: "assets/plat/logo-inventre.png", photo: "assets/plat/edu-inventre.jpg",
          desc: "Seamless service for design and management of school supplies, integrated with technology across schools.",
          metrics: [{ value: "17", label: "Schools" }, { value: "18K+", label: "Students" }, { value: "5K+", label: "Products" }, { value: "$2.4M+", label: "Order book" }] },
        { name: "Abeona", logo: "assets/plat/logo-abeona.png", photo: "assets/plat/edu-abeona.jpg",
          desc: "Tech-driven school transportation ensuring safe, reliable, and convenient journeys with a growing commitment to sustainability.",
          metrics: [{ value: "10", label: "Schools" }, { value: "4.6K+", label: "Students" }, { value: "180", label: "Fleet" }, { value: "$1.9M+", label: "Revenue" }] },
      ]},
    ],
  },

  powerx: {
    name: "PoweRx", sector: "Lifesciences", wordmark: "assets/plat/wm-powerx.png",
    hero: "assets/plat/rx-infra.jpg", video: "assets/plat/hero-powerx.mp4",
    tagline: "A lifesciences ecosystem driving innovation through purpose-built infrastructure, advanced research environments, and integrated support services.",
    intro: "PoweRx creates enabling ecosystems that combine world-class laboratories, specialised operational services, and collaborative environments — letting scientists, researchers, and businesses focus on discovery, development, and growth.",
    totals: [
      { value: "6.5 Mn+", label: "SFT of labspace" },
      { value: "03", label: "Clusters" },
      { value: "85+", label: "Research clients" },
      { value: "2", label: "Operating verticals" },
    ],
    categories: [
      { label: "Infrastructure", ventures: [
        { name: "NXT", logo: "assets/plat/logo-nxt.png", photo: "assets/plat/rx-infra.jpg",
          desc: "Tailored infrastructure solutions for dynamic lifesciences clusters — modular & customised environments, build-outs, campus management, and flexible ownership models.",
          metrics: [{ value: "1 Mn+ SFT", label: "Operational" }, { value: "3 Mn+ SFT", label: "Planning & design" }, { value: "2.5 Mn+ SFT", label: "Under development" }, { value: "4 Lakh SFT", label: "AALV" }] },
      ]},
      { label: "Research & Manufacturing", ventures: [
        { name: "CRAMS", logo: "", photo: "assets/plat/rx-crams.jpg",
          desc: "Contract Research and Manufacturing Services — an integrated research platform offering drug discovery and preclinical solutions for pharma and biotech companies.",
          metrics: [{ value: "35K+ SFT", label: "Active" }, { value: "35K+ SFT", label: "Pipeline" }, { value: "85+", label: "Clients" }] },
      ]},
    ],
  },

  powercare: {
    name: "PowerCare", sector: "Healthcare", wordmark: "assets/plat/wm-powercare.png",
    hero: "assets/plat/care-medical.jpg", video: "assets/plat/hero-powercare.mp4",
    tagline: "A healthcare solutions network designed around patient and practitioner needs — creating seamless care experiences through thoughtfully planned environments and high-quality infrastructure.",
    intro: "PowerCare reimagines where care happens: experiential medical environments and flexible clinical spaces built around the people who deliver and receive care.",
    totals: [
      { value: "1st", label: "Centre launched" },
      { value: "2.4 Lakh+", label: "SFT in pipeline" },
      { value: "35-40", label: "Centres (5-yr target)" },
      { value: "2", label: "Care formats" },
    ],
    categories: [
      { label: "Infrastructure", ventures: [
        { name: "The Medical Centre", logo: "assets/plat/logo-medical.png", photo: "assets/plat/care-medical.jpg",
          desc: "Experiential environments for healthcare professionals and operators. First centre launched in Hitech City, with a 5-year target of 35–40 centres.",
          metrics: [{ value: "1st", label: "Centre launched" }, { value: "35 K+ SFT", label: "Active" }, { value: "2 Lakh+ SFT", label: "Pipeline" }] },
        { name: "Edge Clinic", logo: "assets/plat/logo-edge.png", photo: "assets/plat/care-edge.jpg",
          desc: "Multidisciplinary co-working spaces for doctors with flexible terms — enabling healthcare professionals to practice independently.",
          metrics: [{ value: "2", label: "Centres in pipeline" }] },
      ]},
    ],
  },

  powerpod: {
    name: "PowerPod", sector: "Managed Living", wordmark: "assets/plat/wm-powerpod.png",
    hero: "assets/plat/pod-madison.jpg", video: "assets/plat/hero-powerpod.mp4",
    tagline: "An infrastructure platform reimagining how professionals live — from purpose-built living spaces to integrated hospitality experiences.",
    intro: "PowerPod brings institutional discipline to hospitality and living, delivering curated dining, lifestyle, and service experiences for professionals across cities.",
    totals: [
      { value: "07", label: "Assets" },
      { value: "05", label: "Cities" },
      { value: "13.4 Lakh+", label: "SFT pipeline + planned" },
      { value: "1,024", label: "Keys across tiers" },
    ],
    categories: [
      { label: "Infrastructure", ventures: [
        { name: "Madison", logo: "assets/plat/logo-madison.png", photo: "assets/plat/pod-madison.jpg",
          desc: "A unified platform for diverse hospitality offerings, enriched by institutional partnerships — delivering curated dining, lifestyle, and service experiences for professionals.",
          metrics: [{ value: "07", label: "Assets" }, { value: "05", label: "Cities" }, { value: "2.53 Lakh+ SFT", label: "Pipeline" }, { value: "10.85 Lakh+ SFT", label: "Planned" }, { value: "373", label: "Keys · Luxury" }, { value: "276", label: "Keys · Upper Upscale" }, { value: "375", label: "Keys · Midscale" }] },
      ]},
    ],
  },
};

const ORDER = ["powered", "powerx", "powercare", "powerpod"];

/* ---------- resolve which platform ---------- */
const params = new URLSearchParams(location.search);
const slug = PLATFORMS[params.get("p")] ? params.get("p") : "powered";
const P = PLATFORMS[slug];
document.title = `${P.name} — JV Ventures`;

/* ---------- render ---------- */
const esc = (s) => s;
document.querySelector(".plat-hero-bg").style.backgroundImage = `url(${P.hero})`;
// hero video: desktop only (videos are heavy); poster image is the mobile fallback
(() => {
  const vid = document.querySelector(".plat-hero-video");
  if (!vid || !P.video) return;
  const allow = window.matchMedia("(min-width: 1024px)").matches &&
                !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!allow) { vid.remove(); return; }
  vid.poster = P.hero;
  vid.src = P.video;
  vid.load();
  const tryPlay = () => vid.play().catch(() => {});
  vid.addEventListener("canplay", () => vid.classList.add("ready"), { once: true });
  tryPlay();
})();
const wm = document.querySelector(".plat-wordmark");
wm.src = P.wordmark; wm.alt = P.name;
document.querySelector(".plat-tagline").textContent = P.tagline;
document.querySelector(".plat-sector").textContent = P.sector.toLowerCase();
document.querySelector(".plat-intro-copy").textContent = P.intro;

// totals band
document.querySelector(".plat-totals").innerHTML = P.totals.map((t) =>
  `<div class="total"><span class="total-num">${t.value}</span><span class="total-label">${t.label}</span></div>`
).join("");

// flatten ventures (with their category) for the stream + rail
const ventures = [];
P.categories.forEach((cat) => cat.ventures.forEach((v) => ventures.push({ ...v, category: cat.label })));

// venture markup helpers
const venLogo = (v) => v.logo ? `<img class="ven-logo" src="${v.logo}" alt="${v.name}">` : `<h3 class="ven-name-text">${v.name}</h3>`;
const venMetrics = (v) => v.metrics.map((m) =>
  `<div class="ven-metric"><span class="ven-metric-num">${m.value}</span><span class="ven-metric-label">${m.label}</span></div>`
).join("");
const railItems = ventures.map((v, i) =>
  `<li class="ven-rail-item${i === 0 ? " active" : ""}" data-i="${i}"><i>${String(i + 1).padStart(2, "0")}</i><span>${v.name}</span></li>`
).join("");

// THEATER mode: cinematic pinned sequence (desktop, 2+ ventures); editorial stream otherwise
const bpDesktop = window.matchMedia("(min-width: 1024px)");
const THEATER = ventures.length > 1 &&
  bpDesktop.matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// theater and stream are different DOM worlds — crossing the breakpoint
// after load (resize / rotate) rebuilds the page in the right mode
const bpAtLoad = bpDesktop.matches;
bpDesktop.addEventListener("change", () => {
  if (bpDesktop.matches !== bpAtLoad) location.reload();
});

if (THEATER) {
  const sec = document.getElementById("ventures");
  sec.classList.add("theater-mode");
  sec.innerHTML = `
  <div class="theater theater--index">
    <header class="thx-top">
      <div class="thx-top-left">
        <span class="ven-rail-kicker">Inside the platform</span>
        <img class="thx-wordmark" src="${P.wordmark}" alt="${P.name}">
      </div>
      <span class="th-count"><span id="th-cur">01</span> / ${String(ventures.length).padStart(2, "0")}</span>
    </header>
    <span class="thx-ghost" aria-hidden="true">01</span>
    <div class="thx-frame">${ventures.map((v, i) =>
      `<div class="th-photo${i === 0 ? " active" : ""}" style="background-image:url(${v.photo})"></div>`).join("")}
    </div>
    <div class="thx-stack">${ventures.map((v, i) => `
      <article class="thx-page${i === 0 ? " active" : ""}" data-i="${i}">
        <h3 class="thx-name"><span class="thx-name-in">${v.name}</span></h3>
        <div class="thx-brand">
          ${v.logo ? `<img class="ven-logo" src="${v.logo}" alt="${v.name}">` : ""}
          <span class="th-cat">${v.category}</span>
        </div>
        <p class="ven-desc">${v.desc}</p>
        <div class="ven-metrics">${venMetrics(v)}</div>
      </article>`).join("")}
    </div>
    <nav class="thx-tabs">
      <ul class="ven-rail-list">${railItems}</ul>
      <div class="thx-track"><div class="thx-fill"></div></div>
    </nav>
  </div>`;
} else {
  // rail
  document.querySelector(".ven-rail-name").innerHTML = `<img src="${P.wordmark}" alt="${P.name}">`;
  document.querySelector(".ven-rail-list").innerHTML = railItems;
  // stream: each venture is a full editorial block; category label shown when it changes
  let lastCat = null;
  document.querySelector(".ven-stream").innerHTML = ventures.map((v, i) => {
    const catHead = v.category !== lastCat ? `<div class="ven-cat">${v.category}</div>` : "";
    lastCat = v.category;
    return `${catHead}
    <article class="ven" id="ven-${i}" data-i="${i}">
      <div class="ven-media"><div class="ven-img" style="background-image:url(${v.photo})"></div></div>
      <div class="ven-body">
        <div class="ven-logo-wrap">${venLogo(v)}</div>
        <p class="ven-desc">${v.desc}</p>
        <div class="ven-metrics">${venMetrics(v)}</div>
      </div>
    </article>`;
  }).join("");
}

// platform switcher (the other three)
document.querySelector(".switch-grid").innerHTML = ORDER.filter((s) => s !== slug).map((s) => {
  const o = PLATFORMS[s];
  return `<a class="switch-tile" href="platform.html?p=${s}">
    <div class="switch-img" style="background-image:url(${o.hero})"></div>
    <div class="switch-meta"><img src="${o.wordmark}" alt="${o.name}"><span>${o.sector}</span></div>
    <span class="switch-go">Explore<span class="arrow">→</span></span>
  </a>`;
}).join("");

/* ============================================================
   MOTION
   ============================================================ */
gsap.registerPlugin(ScrollTrigger);
const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const MOBILE = window.matchMedia("(max-width: 1023px)").matches;
const EASE = "power3.out";
let lenis = null;
if (!REDUCED) {
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  window.__lenis = lenis;
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* line + reveal primitives */
document.querySelectorAll(".line-inner").forEach((el) => {
  gsap.to(el, { y: 0, duration: REDUCED ? 0 : 1.2, ease: EASE,
    scrollTrigger: el.closest(".plat-hero") ? null : { trigger: el.closest(".line"), start: "top 90%", once: true } });
});
if (REDUCED) gsap.set(".plat-hero .line-inner", { y: 0 });
document.querySelectorAll(".reveal").forEach((el) => {
  gsap.to(el, { opacity: 1, y: 0, duration: REDUCED ? 0 : 0.7, ease: EASE,
    scrollTrigger: { trigger: el, start: "top 90%", once: true } });
});

/* hero entrance + parallax */
if (!REDUCED) {
  gsap.from(".plat-wordmark", { opacity: 0, y: 30, duration: 1, ease: EASE, delay: 0.2 });
  gsap.from(".plat-tagline", { opacity: 0, y: 24, duration: 0.9, ease: EASE, delay: 0.5 });
  gsap.to(".plat-hero-media", { yPercent: 18, ease: "none",
    scrollTrigger: { trigger: ".plat-hero", start: "top top", end: "bottom top", scrub: 0.4 } });
}

/* totals count-up */
document.querySelectorAll(".total-num").forEach((el) => {
  const raw = el.textContent;
  const m = raw.match(/([\d,.]+)/);
  if (!m || REDUCED) return;
  const numStr = m[1], target = parseFloat(numStr.replace(/,/g, ""));
  if (!isFinite(target) || target === 0) return;
  const decimals = (numStr.split(".")[1] || "").length;
  ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: () => {
    const obj = { v: 0 };
    gsap.to(obj, { v: target, duration: 1.3, ease: "power2.out", onUpdate: () => {
      const val = decimals ? obj.v.toFixed(decimals) : Math.round(obj.v).toLocaleString("en-IN");
      el.textContent = raw.replace(numStr, val);
    }});
  }});
});

/* ventures: theater (pinned beats) or editorial stream */
(() => {
  if (THEATER) {
    const sec = document.getElementById("ventures");
    const photos = gsap.utils.toArray(".th-photo");
    const pages = gsap.utils.toArray(".thx-page");
    const items = gsap.utils.toArray(".ven-rail-item");
    const ghost = document.querySelector(".thx-ghost");
    const counter = document.getElementById("th-cur");
    const N = photos.length;
    const counted = new Set();
    let cur = -1;

    const countMetrics = (panel) => {
      if (counted.has(panel)) return;
      counted.add(panel);
      panel.querySelectorAll(".ven-metric-num").forEach((el) => {
        const raw = el.textContent;
        const m = raw.match(/([\d,.]+)/);
        if (!m) return;
        const numStr = m[1], target = parseFloat(numStr.replace(/,/g, ""));
        if (!isFinite(target) || target === 0) return;
        const decimals = (numStr.split(".")[1] || "").length;
        const obj = { v: 0 };
        gsap.to(obj, { v: target, duration: 1, ease: "power2.out", onUpdate: () => {
          const val = decimals ? obj.v.toFixed(decimals) : Math.round(obj.v).toLocaleString("en-IN");
          el.textContent = raw.replace(numStr, val);
        }});
      });
    };

    const setBeat = (i) => {
      if (i === cur) return;
      cur = i;
      photos.forEach((p, j) => p.classList.toggle("active", j === i));
      pages.forEach((p, j) => p.classList.toggle("active", j === i));
      items.forEach((it, j) => it.classList.toggle("active", j === i));
      counter.textContent = String(i + 1).padStart(2, "0");
      if (ghost) {
        ghost.textContent = String(i + 1).padStart(2, "0");
        gsap.fromTo(ghost, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" });
      }
      countMetrics(pages[i]);
    };

    const st = ScrollTrigger.create({
      trigger: sec, start: "top top", end: "+=" + N * 110 + "%",
      pin: true,
      onUpdate: (self) => {
        setBeat(Math.min(N - 1, Math.floor(self.progress * N)));
        gsap.set(".thx-fill", { scaleX: self.progress });
      },
    });
    setBeat(0);

    // rail click → jump to that venture's beat
    items.forEach((it) => it.addEventListener("click", () => {
      const i = +it.dataset.i;
      const y = st.start + ((st.end - st.start) * (i + 0.5)) / N;
      lenis ? lenis.scrollTo(y, { duration: 0.9 }) : window.scrollTo({ top: y, behavior: "smooth" });
    }));
    return;
  }

  // editorial stream (mobile / reduced motion / single venture)
  const items = gsap.utils.toArray(".ven-rail-item");
  const blocks = gsap.utils.toArray(".ven");
  if (!blocks.length) return;
  const setActive = (i) => items.forEach((it, j) => it.classList.toggle("active", j === i));
  setActive(0);
  blocks.forEach((b, i) => {
    ScrollTrigger.create({ trigger: b, start: "top 55%", end: "bottom 55%",
      onToggle: (self) => self.isActive && setActive(i) });
    if (!REDUCED) {
      const img = b.querySelector(".ven-img");
      gsap.fromTo(img, { scale: 1.08 }, { scale: 1, ease: "none",
        scrollTrigger: { trigger: b, start: "top bottom", end: "top 40%", scrub: 0.5 } });
    }
  });
  items.forEach((it) => it.addEventListener("click", () => {
    const target = blocks[+it.dataset.i];
    lenis ? lenis.scrollTo(target, { offset: -120, duration: 1 }) : target.scrollIntoView({ behavior: "smooth" });
  }));
})();

/* closing bridge */
(() => {
  const img = document.querySelector(".close-bridge img");
  if (!img || REDUCED) return;
  gsap.to(img, { clipPath: "inset(0 0% 0 0)", duration: 1.8, ease: "power2.inOut",
    scrollTrigger: { trigger: ".act-close", start: "top 60%", once: true } });
})();

/* smart header */
(() => {
  const header = document.querySelector(".site-header");
  let lastY = 0;
  const onScroll = (y) => {
    header.classList.toggle("scrolled", y > 40);
    header.classList.toggle("tucked", y > lastY + 2 && y > 320);
    if (y < lastY - 2) header.classList.remove("tucked");
    lastY = y;
  };
  if (window.__lenis) window.__lenis.on("scroll", (e) => onScroll(e.scroll));
  else window.addEventListener("scroll", () => onScroll(window.scrollY), { passive: true });
})();

document.querySelectorAll('a[href="#"]').forEach((a) => a.addEventListener("click", (e) => e.preventDefault()));
window.addEventListener("resize", () => ScrollTrigger.refresh());
