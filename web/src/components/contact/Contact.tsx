'use client'

import { type FormEvent, useRef, useState } from 'react'

import { useSmoothScroll } from '@/components/SmoothScroll'
import type { ContactPage, SiteSettings } from '@/content/types'
import { EASE, gsap, useGSAP } from '@/lib/gsap'

import { submitEnquiry } from '@/app/(frontend)/contact/actions'

import styles from './Contact.module.css'

const mapSrc = (query: string) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=m&z=10&output=embed&iwloc=near`

export function Contact({ contact }: { contact: ContactPage; settings: SiteSettings }) {
  const scope = useRef<HTMLElement>(null)
  const { reduced } = useSmoothScroll()

  const hero = contact?.hero
  const offices = contact?.offices ?? []
  const enquiryTypes = contact?.enquiryTypes ?? []
  const form = contact?.form
  const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

  const heroHeading = hero?.title?.lines?.join(' ') || 'Contact Us'

  // Form state / validation (preserved from the original component).
  const [enquiry, setEnquiry] = useState(enquiryTypes[0] ?? '')
  const [sent, setSent] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Which office's map is visible (default = first office).
  const [activeOffice, setActiveOffice] = useState(0)

  useGSAP(
    () => {
      if (reduced) return
      const root = scope.current
      if (!root) return
      gsap.utils.toArray<HTMLElement>(`.${styles.fade}`).forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: EASE,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          },
        )
      })
    },
    { scope, dependencies: [reduced] },
  )

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (submitting) return
    const data = new FormData(e.currentTarget)
    const fn = String(data.get('firstName') || '').trim()
    const em = String(data.get('email') || '').trim()
    const msg = String(data.get('message') || '').trim()
    setError('')
    if (!fn) return setError(form?.errorName || 'Please enter your first name.')
    if (!EMAIL_RE.test(em)) return setError(form?.errorEmail || 'Please enter a valid email address.')
    if (!msg) return setError(form?.errorMessage || 'Please enter a message.')
    setSubmitting(true)
    try {
      const res = await submitEnquiry({
        enquiry: String(data.get('enquiry') || ''),
        firstName: fn,
        lastName: String(data.get('lastName') || ''),
        email: em,
        phone: String(data.get('phone') || ''),
        company: String(data.get('company') || ''),
        message: msg,
      })
      if (res.ok) {
        setFirstName(fn)
        setSent(true)
      } else {
        setError(res.error || form?.errorGeneric || 'Something went wrong. Please try again.')
      }
    } catch {
      setError(form?.errorNetwork || 'Network error. Please try again, or email us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  const active = offices[activeOffice] ?? offices[0]

  return (
    <main id="top" ref={scope} className={styles.main}>
      {/* HERO — faint ghosted watermark heading overlapping the top of the content */}
      <section className={styles.hero} data-cms-section="hero">
        <h1 className={styles.heroTitle}>{heroHeading}</h1>
      </section>

      {/* TWO-COLUMN BLOCK */}
      <section className={styles.section} data-cms-section="details">
        <div className={styles.layout}>
          {/* LEFT — offices + map */}
          <div className={`${styles.fade} ${styles.leftCol}`}>
            <ul className={styles.officeList} data-cms-section="offices">
              {(offices ?? []).map((o, i) => (
                <li key={o?.address || o?.city || i}>
                  <button
                    type="button"
                    className={`${styles.officeBtn}${i === activeOffice ? ` ${styles.officeBtnActive}` : ''}`}
                    aria-pressed={i === activeOffice}
                    onClick={() => setActiveOffice(i)}
                  >
                    <span className={styles.officeCity}>
                      <svg
                        className={styles.officePin}
                        viewBox="0 0 384 512"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" />
                      </svg>
                      {o?.city}
                    </span>
                    {o?.address ? <span className={styles.officeAddress}>{o.address}</span> : null}
                  </button>
                </li>
              ))}
            </ul>

            {active ? (
              <div className={styles.mapFrame}>
                <iframe
                  key={active.mapQuery || active.city}
                  className={styles.mapIframe}
                  src={mapSrc(active.mapQuery || active.city)}
                  title={active.mapQuery || active.city}
                  aria-label={active.mapQuery || active.city}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : null}
          </div>

          {/* RIGHT — enquiry selector + form */}
          <div className={`${styles.fade} ${styles.rightCol}`}>
            {sent ? (
              <div className={styles.success} role="status">
                <h2 className={styles.successTitle}>
                  {form?.successTitle || 'Thank you'}
                  {firstName ? `, ${firstName}` : ''}.
                </h2>
                <p className={styles.successBody}>
                  {form?.successBody ||
                    'Your message is on its way. Someone from the team will be in touch shortly.'}
                </p>
                <button type="button" className={styles.reset} onClick={() => setSent(false)}>
                  {form?.resetLabel || 'Send another message'}
                </button>
              </div>
            ) : (
              <>
                {(enquiryTypes ?? []).length > 0 ? (
                  <details className={styles.accordion}>
                    <summary className={styles.accordionSummary}>
                      <span>{form?.enquiryLabel || 'Enquiry Type'}</span>
                      <svg
                        className={styles.accordionChevron}
                        viewBox="0 0 448 512"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
                      </svg>
                    </summary>
                    <ul className={styles.enquiryOptions} role="group" aria-label={form?.enquiryLabel || 'Enquiry Type'}>
                      {(enquiryTypes ?? []).map((t) => (
                        <li key={t}>
                          <button
                            type="button"
                            className={`${styles.enquiryOption}${t === enquiry ? ` ${styles.enquiryOptionActive}` : ''}`}
                            aria-pressed={t === enquiry}
                            onClick={() => setEnquiry(t)}
                          >
                            {t}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : null}

                <form className={styles.form} data-cms-section="form" onSubmit={onSubmit}>
                  <input type="hidden" name="enquiry" value={enquiry} />

                  <div className={styles.row}>
                    <label className={styles.field}>
                      <input
                        className={styles.input}
                        type="text"
                        name="firstName"
                        autoComplete="given-name"
                        placeholder={`${form?.firstName || 'First Name'}*`}
                        aria-label={form?.firstName || 'First Name'}
                        required
                      />
                    </label>
                    <label className={styles.field}>
                      <input
                        className={styles.input}
                        type="text"
                        name="lastName"
                        autoComplete="family-name"
                        placeholder={`${form?.lastName || 'Last Name'}*`}
                        aria-label={form?.lastName || 'Last Name'}
                        required
                      />
                    </label>
                  </div>

                  <div className={styles.row}>
                    <label className={styles.field}>
                      <input
                        className={styles.input}
                        type="tel"
                        name="phone"
                        autoComplete="tel"
                        placeholder={`${form?.phone || 'Phone no'}*`}
                        aria-label={form?.phone || 'Phone'}
                        required
                      />
                    </label>
                    <label className={styles.field}>
                      <input
                        className={styles.input}
                        type="email"
                        name="email"
                        autoComplete="email"
                        placeholder={`${form?.email || 'Email Id'}*`}
                        aria-label={form?.email || 'Email'}
                        aria-invalid={error.toLowerCase().includes('email') || undefined}
                        required
                      />
                    </label>
                  </div>

                  <label className={styles.field}>
                    <input
                      className={styles.input}
                      type="text"
                      name="company"
                      autoComplete="organization"
                      placeholder={`${form?.company || 'Company Name'}*`}
                      aria-label={form?.company || 'Company Name'}
                      required
                    />
                  </label>

                  <label className={styles.field}>
                    <textarea
                      className={styles.textarea}
                      name="message"
                      rows={6}
                      maxLength={2000}
                      placeholder={`${form?.message || 'Query'}*`}
                      aria-label={form?.message || 'Query'}
                      required
                    />
                  </label>

                  {error ? (
                    <p className={styles.error} role="alert">
                      {error}
                    </p>
                  ) : null}

                  <button type="submit" className={styles.submit} disabled={submitting} aria-busy={submitting}>
                    {submitting ? form?.submitting || 'Sending…' : form?.submit || 'SUBMIT'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
