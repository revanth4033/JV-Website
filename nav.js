/* shared mobile nav: hamburger toggles the full-screen menu overlay */
(() => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  if (!header || !toggle) return;

  const setLenis = (open) => {
    if (window.__lenis) open ? window.__lenis.stop() : window.__lenis.start();
  };
  const close = () => {
    if (!header.classList.contains("nav-open")) return;
    header.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    setLenis(false);
  };

  toggle.addEventListener("click", () => {
    const open = header.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    setLenis(open);
  });

  // tapping any real link closes the menu (the dummy "Platform" label has
  // pointer-events:none on mobile, so it never fires this)
  header.querySelectorAll(".site-nav a").forEach((a) =>
    a.addEventListener("click", close)
  );

  window.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
})();
