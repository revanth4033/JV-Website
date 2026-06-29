'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

import { useSmoothScroll } from '@/components/SmoothScroll'
import { asset } from '@/content'
import type { SiteSettings, TeamMember, TeamPage } from '@/content/types'
import { EASE, gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'

import styles from './Team.module.css'

/** LinkedIn glyph (lucide dropped brand icons in this version). */
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
  </svg>
)

const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/** "Jasmeet Chhabra" -> "JC", "Sai Krishna Narla" -> "SN". */
const initials = (name: string): string => {
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

function LinkedIn({ name, href }: { name: string; href?: string }) {
  if (!href) return null
  return (
    <a
      className={styles.liLink}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${name} on LinkedIn`}
    >
      <LinkedInIcon />
    </a>
  )
}

export function Team({ team }: { team: TeamPage; settings: SiteSettings }) {
  const scope = useRef<HTMLDivElement>(null)
  const { reduced } = useSmoothScroll()
  const [active, setActive] = useState<TeamMember | null>(null)
  const opener = useRef<HTMLElement | null>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)

  const hero = team?.hero
  const founders = team?.founders ?? []
  const groups = team?.groups ?? []

  const heroLines = hero?.title?.lines ?? []
  const heroHtml = heroLines.length ? heroLines.join(' ') : 'Team'

  const openModal = useCallback((member: TeamMember, e: React.MouseEvent) => {
    opener.current = e.currentTarget as HTMLElement
    setActive(member)
  }, [])

  const closeModal = useCallback(() => {
    setActive(null)
    opener.current?.focus()
  }, [])

  // Esc to close + focus the close button when the modal opens.
  useEffect(() => {
    if (!active) return
    closeBtn.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeModal()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [active, closeModal])

  // Simple GSAP entrance: founders fade-up, cards stagger per row. Respect reduced.
  useGSAP(
    () => {
      if (reduced) return
      const root = scope.current
      if (!root) return

      gsap.utils.toArray<HTMLElement>('[data-anim="founder"]').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 40,
          duration: 0.9,
          ease: EASE,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-anim="card"]').forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          y: 36,
          duration: 0.7,
          ease: EASE,
          delay: (i % 4) * 0.08,
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        })
      })

      ScrollTrigger.refresh()
    },
    { scope, dependencies: [reduced] },
  )

  return (
    <div ref={scope} className={styles.page}>
      <main id="top">
        {/* Hero — big page title */}
        <section className={styles.hero} data-cms-section="hero">
          <h1
            className={styles.heroTitle}
            dangerouslySetInnerHTML={{ __html: heroHtml }}
          />
        </section>

        {/* Founders — side-by-side cards with READ MORE modal */}
        {founders.length ? (
          <section className={styles.founders} data-cms-section="founders">
            {(founders ?? []).map((f) => (
              <article className={styles.founder} data-anim="founder" key={f.name}>
                <div className={styles.founderBody}>
                  <h2 className={styles.founderName}>{f.name}</h2>
                  {f.role ? <p className={styles.founderRole}>{f.role}</p> : null}
                  {f.bio ? <p className={styles.founderBio}>{f.bio}</p> : null}
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.btn}
                      onClick={(e) => openModal(f, e)}
                      aria-haspopup="dialog"
                    >
                      Read More
                      <ChevronIcon />
                    </button>
                    <LinkedIn name={f.name} href={f.linkedin} />
                  </div>
                </div>

                <div className={styles.founderMedia}>
                  {f.photo ? (
                    <Image
                      src={asset(f.photo)}
                      alt={f.photoAlt || f.name}
                      fill
                      sizes="(max-width: 768px) 90vw, 40vw"
                    />
                  ) : (
                    <div className={styles.monogram} aria-hidden="true">
                      {initials(f.name)}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </section>
        ) : null}

        {/* Platform leaders — hover-card grid, grouped by venture */}
        {groups.length ? (
          <section className={styles.leaders} data-cms-section="roster">
            <header className={styles.sectionHead}>
              {team?.rosterTitle ? (
                <h2 className={styles.sectionTitle}>{team.rosterTitle}</h2>
              ) : null}
              {team?.rosterCopy ? (
                <p className={styles.sectionCopy}>{team.rosterCopy}</p>
              ) : null}
            </header>

            {groups.map((group) => (
              <div className={styles.group} key={group.venture || 'group'}>
                {group.venture ? (
                  <h3 className={styles.groupHeading}>{group.venture}</h3>
                ) : null}
                <div className={styles.grid}>
                  {(group.members ?? []).map((m) => (
                    <figure className={styles.card} data-anim="card" key={m.name}>
                      {m.photo ? (
                        <img
                          className={styles.cardImg}
                          src={asset(m.photo)}
                          alt={m.photoAlt || m.name}
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className={styles.monogram} aria-hidden="true">
                          {initials(m.name)}
                        </div>
                      )}
                      <figcaption className={styles.cardOverlay}>
                        <h5 className={styles.cardName}>{m.name}</h5>
                        {m.role ? <p className={styles.cardRole}>{m.role}</p> : null}
                        <LinkedIn name={m.name} href={m.linkedin} />
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            ))}
          </section>
        ) : null}
      </main>

      {/* READ MORE modal */}
      {active ? (
        <div
          className={styles.backdrop}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal()
          }}
        >
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="team-modal-title"
          >
            <button
              type="button"
              ref={closeBtn}
              className={styles.modalClose}
              onClick={closeModal}
              aria-label="Close"
            >
              &times;
            </button>
            {active.role ? <span className={styles.modalRole}>{active.role}</span> : null}
            <h2 id="team-modal-title" className={styles.modalTitle}>
              {active.name}
            </h2>
            <div className={styles.modalBody}>
              {active.bio ? <p>{active.bio}</p> : null}
              {active.bioFull ? <p>{active.bioFull}</p> : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
