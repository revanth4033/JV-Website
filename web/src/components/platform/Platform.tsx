'use client'

import { useRef, useState } from 'react'

import { useSmoothScroll } from '@/components/SmoothScroll'
import { asset } from '@/content'
import type { Platform as PlatformT, SiteSettings, Venture } from '@/content/types'
import { EASE, gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'

import styles from './Platform.module.css'

/** Chevron used in the accordion title rows. */
function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

/** A single venture card: logo (linked) + description + stats grid + photo. */
function VentureCard({ venture, open }: { venture: Venture; open: boolean }) {
  // Old site shows each venture's real brand logo (e.g. red CAPPELLA) on the
  // light open panel — the logos are already colour assets, so no tint.
  const logo = venture.logo ? (
    <img
      className={styles.logo}
      src={asset(venture.logo)}
      alt={venture.logoAlt ?? venture.name}
      loading="lazy"
      decoding="async"
    />
  ) : null

  return (
    <article className={styles.card}>
      <div className={styles.cardText}>
        {logo ? (
          venture.href ? (
            <a className={styles.logoLink} href={venture.href} target="_blank" rel="noopener noreferrer">
              {logo}
            </a>
          ) : (
            <span className={styles.logoLink}>{logo}</span>
          )
        ) : (
          <h3>{venture.name}</h3>
        )}

        {venture.desc ? <p className={styles.desc}>{venture.desc}</p> : null}

        {(venture.metrics ?? []).length > 0 ? (
          <div className={styles.stats}>
            {(venture.metrics ?? []).map((m, i) => (
              <div className={styles.stat} key={`${m.label}-${i}`}>
                <span className={styles.statValue}>{m.value}</span>
                <span className={styles.statLabel}>{m.label}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {venture.photo ? (
        <div className={styles.photoWrap}>
          <img
            className={styles.photo}
            src={asset(venture.photo)}
            alt={venture.photoAlt ?? venture.name}
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : null}
    </article>
  )
}

export function Platform({
  platform,
  others: _others,
  settings: _settings,
}: {
  platform: PlatformT
  others: PlatformT[]
  settings: SiteSettings
}) {
  const scope = useRef<HTMLElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const heroTextRef = useRef<HTMLDivElement>(null)
  const { reduced } = useSmoothScroll()

  const categories = platform?.categories ?? []
  // ONE open at a time; first category open by default.
  const [openCat, setOpenCat] = useState(0)

  // fadeInUp entrances (skipped under reduced-motion, which leaves CSS defaults).
  useGSAP(
    () => {
      if (reduced) return
      const root = scope.current
      if (!root) return
      gsap.utils.toArray<HTMLElement>(`.${styles.fade}`).forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: EASE,
            scrollTrigger: el.closest(`.${styles.hero}`)
              ? undefined
              : { trigger: el, start: 'top 88%', once: true },
          },
        )
      })

      /* Hero banner — the video grid expands from (text | video) to full-width
         while the section is pinned, exactly like the old jv.ventures platform
         banner (gridTemplateColumns 38% 62% -> 0% 100%, text slides up & fades).
         Desktop only; mobile keeps the static stacked layout. */
      const hero = heroRef.current
      const grid = gridRef.current
      const heroText = heroTextRef.current
      if (hero && grid && heroText && platform?.video && window.matchMedia('(min-width: 768px)').matches) {
        const video = grid.querySelector<HTMLElement>('.' + styles.heroVideo)
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: '+=100%',
            scrub: 0.3,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
        // Sequenced: FIRST the text slides up and fades, THEN the video grows
        // leftward on top of it (same expand) to full width. The grid stays
        // 38% / 62% throughout, so the text never reflows.
        // 100% / 0.62 ≈ 161.29% wide, shifted left by 0.38/0.62 ≈ 61.29%.
        tl.to(heroText, { yPercent: -55, opacity: 0, ease: 'none', duration: 0.45 })
        if (video) {
          tl.fromTo(
            video,
            { width: '100%', marginLeft: '0%' },
            { width: '161.29%', marginLeft: '-61.29%', ease: 'none', duration: 0.55 },
          )
        }
      }
    },
    { scope, dependencies: [reduced, platform?.slug] },
  )

  return (
    <main id="top" className={styles.main} ref={scope}>
      {/* 1. HERO — text + video banner that expands to full-width on scroll. */}
      <section className={`${styles.hero} ${styles.fade}`} data-cms-section="hero" ref={heroRef}>
        <h1 className="sr-only">
          {platform?.name} — {platform?.sector} platform
        </h1>
        <div className={styles.heroGrid} ref={gridRef}>
          <div className={styles.heroText} ref={heroTextRef}>
            {platform?.wordmark ? (
              <img
                className={styles.wordmark}
                src={asset(platform.wordmark)}
                alt={platform?.name ?? ''}
                data-cms-section="identity"
              />
            ) : null}
            {platform?.tagline ? <p className={styles.tagline}>{platform.tagline}</p> : null}
            {platform?.overview ? <p className={styles.overview}>{platform.overview}</p> : null}
          </div>
          <div className={styles.heroMedia}>
            {platform?.video ? (
              <video
                className={styles.heroVideo}
                src={asset(platform.video)}
                poster={platform?.hero ? asset(platform.hero) : undefined}
                autoPlay={!reduced}
                loop
                muted
                playsInline
                preload="metadata"
              />
            ) : platform?.hero ? (
              <img
                className={styles.heroImg}
                src={asset(platform.hero)}
                alt={platform?.name ?? ''}
                loading="eager"
                decoding="async"
              />
            ) : null}
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES / VENTURES ACCORDION */}
      <div className={`${styles.accordion} ${styles.section}`} data-cms-section="categories">
        {categories.map((cat, i) => {
          const open = openCat === i
          const panelId = `plat-cat-panel-${i}`
          const btnId = `plat-cat-btn-${i}`
          return (
            <section className={`${styles.cat} ${open ? styles.catOpen : ''} ${styles.fade}`} key={`${cat?.label}-${i}`}>
              <h2 style={{ margin: 0 }}>
                <button
                  type="button"
                  id={btnId}
                  className={styles.catTitle}
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenCat(open ? -1 : i)}
                >
                  <span>{cat?.label}</span>
                  <Chevron open={open} />
                </button>
              </h2>
              <div
                id={panelId}
                role="region"
                aria-labelledby={btnId}
                className={`${styles.panel} ${open ? styles.panelOpen : ''}`}
                inert={!open}
              >
                <div className={styles.panelInner}>
                  <div className={styles.panelPad}>
                    {(cat?.ventures ?? []).map((v, j) => (
                      <VentureCard venture={v} open={open} key={`${v?.name}-${j}`} />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )
        })}
      </div>
    </main>
  )
}
